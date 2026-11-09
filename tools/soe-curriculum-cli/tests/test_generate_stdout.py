"""Exercise single-format stdout delivery through the real Click command."""

import json
from inspect import signature
from pathlib import Path
import unittest

from click.testing import CliRunner
from soe_curriculum.cli import main


class GenerateStdoutTests(unittest.TestCase):
    def setUp(self):
        # Click 8.1 needs opt-in separation; 8.2+ always captures both streams.
        runner_options = {'mix_stderr': False} if 'mix_stderr' in signature(CliRunner).parameters else {}
        self.runner = CliRunner(**runner_options)
        self.filesystem = self.runner.isolated_filesystem()
        self.filesystem.__enter__()
        self.addCleanup(self.filesystem.__exit__, None, None, None)
        data = Path('web/src/data')
        data.mkdir(parents=True)
        # Complete synthetic catalog inputs prevent fallback to checkout data.
        catalog = {
            'tracks.json': [{'id': 7, 'slug': 'drill-time', 'title': 'Rythme & café',
                             'landId': 'vitalis'}],
            'lands.json': [{'id': 'vitalis', 'name': 'Vitalis',
                            'duoLabel': 'Fixture guides'}],
            'heroes.json': [{'id': 'fixture', 'name': 'Fixture guide',
                             'landId': 'vitalis'}],
        }
        for name, contents in catalog.items():
            (data / name).write_text(json.dumps(contents), encoding='utf-8')
        self.original_files = self.snapshot()

    def snapshot(self):
        return {str(p): p.read_bytes() for p in Path('.').rglob('*') if p.is_file()}

    def assert_content(self, result, output_format):
        self.assertEqual(result.exit_code, 0, repr(result.exception))
        self.assertEqual(result.stderr, '')
        self.assertNotIn('Generated lesson package', result.stdout)
        if output_format == 'html':
            self.assertTrue(result.stdout.startswith('<!DOCTYPE html>'), result.stdout)
            self.assertIn('<h1 class="card-title">Track 7: Rythme &amp; café</h1>', result.stdout)
        elif output_format == 'json':
            payload = json.loads(result.stdout)
            self.assertEqual(payload['track_id'], 7)
            self.assertEqual(payload['track_slug'], 'drill-time')
            self.assertEqual(payload['title'], 'Rythme & café')
        else:
            self.assertTrue(result.stdout.startswith('# '), result.stdout)
            self.assertIn('Track 7: Rythme & café', result.stdout)

    def test_html_stdout_outputs_html_without_files(self):
        result = self.runner.invoke(main, ['generate', 'drill-time', '--format', 'html', '--stdout'])
        self.assert_content(result, 'html')
        self.assertEqual(self.snapshot(), self.original_files)

    def test_md_and_json_stdout_keep_content_without_files(self):
        for output_format in ['md', 'json']:
            with self.subTest(output_format=output_format):
                result = self.runner.invoke(main, ['generate', 'drill-time', '-f', output_format, '--stdout'])
                self.assert_content(result, output_format)
                self.assertEqual(self.snapshot(), self.original_files)

    def test_default_format_stdout_is_markdown(self):
        result = self.runner.invoke(main, ['generate', 'drill-time', '--stdout'])
        self.assert_content(result, 'md')
        self.assertEqual(self.snapshot(), self.original_files)

    def test_stdout_does_not_create_requested_output_directory(self):
        for output_format in ['md', 'html', 'json']:
            with self.subTest(output_format=output_format):
                result = self.runner.invoke(main, ['generate', 'drill-time', '-f', output_format,
                                                  '--stdout', '-o', 'unused/nested'])
                self.assert_content(result, output_format)
                self.assertFalse(Path('unused').exists())
                self.assertEqual(self.snapshot(), self.original_files)

    def test_stdout_does_not_require_a_writable_output_directory(self):
        Path('occupied').write_text('keep me', encoding='utf-8')
        before = self.snapshot()
        for output_format in ['md', 'html', 'json']:
            with self.subTest(output_format=output_format):
                result = self.runner.invoke(main, ['generate', 'drill-time', '-f', output_format,
                                                  '--stdout', '-o', 'occupied'])
                self.assert_content(result, output_format)
                self.assertEqual(self.snapshot(), before)

    def test_default_file_delivery_is_preserved(self):
        result = self.runner.invoke(main, ['generate', 'drill-time', '-o', 'default'])
        self.assertEqual(result.exit_code, 0, repr(result.exception))
        self.assertTrue(Path('default').is_dir())
        self.assertEqual([p.name for p in Path('default').iterdir()], ['drill-time.md'])
        self.assertIn('Track 7: Rythme & café', Path('default/drill-time.md').read_text(encoding='utf-8'))

    def test_explicit_file_formats_and_all_are_preserved(self):
        for output_format in ['md', 'html', 'json', 'all']:
            with self.subTest(output_format=output_format):
                result = self.runner.invoke(main, ['generate', 'drill-time', '-f', output_format, '-o', output_format])
                self.assertEqual(result.exit_code, 0, repr(result.exception))
                formats = ['md', 'html', 'json'] if output_format == 'all' else [output_format]
                self.assertTrue(Path(output_format).is_dir())
                self.assertEqual({p.name for p in Path(output_format).iterdir()},
                                 {f'drill-time.{ext}' for ext in formats})
                self.assertIn('Generated lesson package', result.stdout)
                for ext in formats:
                    content = Path(output_format, f'drill-time.{ext}').read_text(encoding='utf-8')
                    self.assertIn('café', content)

    def test_unknown_track_fails_without_creating_output(self):
        result = self.runner.invoke(main, ['generate', 'missing-track', '-f', 'html', '--stdout', '-o', 'unused'])
        self.assertEqual(result.exit_code, 1)
        self.assertIn('not found', result.stdout)
        self.assertFalse(Path('unused').exists())
        self.assertEqual(self.snapshot(), self.original_files)


if __name__ == '__main__':
    unittest.main()
