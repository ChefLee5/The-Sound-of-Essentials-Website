import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@astryxdesign/core/Badge';
import { Button } from '@astryxdesign/core/Button';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import SoeAstryxTheme from './SoeAstryxTheme';
import './ResearchAssistant.css';

const KNOWLEDGE_ENTRIES = [
  {
    id: 'clock',
    keywords: [
      'clock', 'time', 'celestia', 'elias', 'selene', 'routine', 'hour',
      'half-hour', 'schedule', '1:00', '12:30', 'reloj', 'hora', 'horloge', 'heure',
    ],
    answer:
      'In "Do You Know What Time It Is?", Elias and Selene count every whole hour from 1:00 to 12:00 and every half-hour from 1:30 to 12:30. Lyrics anchor each count from morning wake-up through lunch and bedtime. When a caregiver points to a wall clock while singing, children ages 2 to 7 connect the spoken number, the beat, and the moving clock hand without screen drills.',
    source: 'Celestia · Teacher’s Guide',
  },
  {
    id: 'rhythm_not_melody',
    keywords: [
      'rhythm', 'melody', 'nature', 'phonolog', 'read', 'scientific reports',
      'ritmo', 'melodia', 'melodía', 'lectura', 'rythme', 'melodie', 'mélodie',
    ],
    answer:
      'A 2022 study in Nature Scientific Reports found that rhythm perception predicts reading ability through phonological awareness, while melody perception does not carry the same link. Hearing steady intervals trains young ears to slice spoken words into clear syllables before formal reading begins.',
    source: 'Nature Scientific Reports (2022)',
  },
  {
    id: 'preschool_10min',
    keywords: [
      '10 min', 'ten min', 'preschool', 'phonics', 'frontier', 'trial',
      'daily music', 'preescolar', 'maternelle', 'minut',
    ],
    answer:
      'In a controlled preschool study published in Frontiers in Psychology (2011), just 10 minutes of daily music training built phonological awareness as effectively as a dedicated phonics program. Short daily sessions fit the natural attention span of ages 2 to 7.',
    source: 'Frontiers in Psychology (2011)',
  },
  {
    id: 'hard_words',
    keywords: [
      'hard word', 'syllable', 'segment', 'luminosity', 'athena', 'ezra',
      'dna', 'gene', 'genome', 'million', 'palabras', 'silab', 'sílab', 'mots', 'syllab',
    ],
    answer:
      '"Hard Words" in Luminosity breaks multi-syllable vocabulary down onto a steady beat, a technique researchers call phonological segmentation. Tapping or stepping each syllable makes long words concrete, and a 2024 Nature Human Behaviour study of over one million people found 16 shared genome regions connecting rhythm skills and language ability.',
    source: 'Nature Human Behaviour (2024)',
  },
  {
    id: 'pedagogy',
    keywords: [
      'dalcroze', 'orff', 'kodaly', 'kodály', 'movement', 'body', 'executive',
      'sequenc', 'pubmed', 'plos', 'pmc', 'group', 'movimiento', 'mouvement',
    ],
    answer:
      'Active group methods pair sound with whole-body movement instead of passive listening. Combining Dalcroze movement with Orff percussion and Kodaly hand signs builds auditory timing alongside motor focus. Peer-reviewed studies in PubMed (2024), PMC (2019), and PLOS ONE (2015) link these active methods to stronger reading gains in young learners.',
    source: 'PubMed (2024) · PLOS ONE (2015)',
  },
  {
    id: 'screen_free',
    keywords: [
      'screen', 'bpm', 'tempo', '90', '110', 'calm', 'workbook', 'age',
      '2-7', '2–7', 'tactile', 'pantalla', 'ecran', 'écran',
    ],
    answer:
      'Every SOE track uses organic instrumentation and steady 90 to 110 BPM pacing tuned for ages 2 to 7. Instead of bright screens and fast cuts, parents and teachers pair audio sessions with physical workbooks and printed routine charts.',
    source: 'SOE Curriculum · Ages 2–7',
  },
];

const GENERAL_FALLBACK = {
  answer:
    'I can answer questions on rhythm perception, 10-minute preschool music trials, clock-reading songs in Celestia, syllable games in Luminosity, or whole-body music pedagogy. Click one of the starter questions above or ask about any study cited on this page.',
  source: 'Cited Research Brief',
};

function resolveLocalResearchAnswer(question) {
  const normalized = question.toLowerCase();
  let bestEntry = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_ENTRIES) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (normalized.includes(kw)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  return bestEntry && bestScore > 0 ? bestEntry : GENERAL_FALLBACK;
}

const ResearchAssistant = () => {
  const { t } = useTranslation();
  const [userQuestion, setUserQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  const API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;

  const starterQuestions = [
    {
      id: 'clock',
      shortLabel: t('assistant.chip_clock', 'Clock & Daily Routines'),
      question: t(
        'assistant.q_clock',
        'How does "Do You Know What Time It Is?" teach clock time?'
      ),
    },
    {
      id: 'rhythm',
      shortLabel: t('assistant.chip_rhythm', 'Rhythm vs. Melody'),
      question: t(
        'assistant.q_rhythm',
        'Why does the research focus on rhythm instead of melody?'
      ),
    },
    {
      id: 'preschool',
      shortLabel: t('assistant.chip_preschool', '10 Minutes a Day'),
      question: t(
        'assistant.q_preschool',
        'How do 10 minutes of daily music compare to phonics drills?'
      ),
    },
    {
      id: 'hard_words',
      shortLabel: t('assistant.chip_syllables', 'Hard Words & Syllables'),
      question: t(
        'assistant.q_syllables',
        'How does breaking "Hard Words" to a beat help kids read?'
      ),
    },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const submitQuestion = async (rawText) => {
    const trimmed = rawText.trim();
    if (!trimmed || isLoading) return;

    setUserQuestion('');
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setIsLoading(true);

    if (!API_KEY) {
      const localMatch = resolveLocalResearchAnswer(trimmed);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: localMatch.answer, source: localMatch.source },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          model: 'sonar-pro',
          messages: [
            { role: 'system', content: t('assistant.system_prompt') },
            ...messages.slice(-4).map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: trimmed },
          ],
        }),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content;
      if (!answer) throw new Error('Empty response');

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: answer, source: 'Live Research Mode' },
      ]);
    } catch (err) {
      console.warn('Research Assistant falling back to local cited brief:', err);
      const localMatch = resolveLocalResearchAnswer(trimmed);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: localMatch.answer, source: localMatch.source },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitQuestion(userQuestion);
  };

  const handleReset = () => {
    setMessages([]);
    setUserQuestion('');
  };

  const askedQuestions = new Set(
    messages.filter((m) => m.role === 'user').map((m) => m.content)
  );
  const remainingStarters = starterQuestions.filter(
    (item) => !askedQuestions.has(item.question)
  );

  return (
    <SoeAstryxTheme>
      <div className="research-assistant" aria-label={t('assistant.title', 'Ask About the Method')}>
        <div className="research-assistant__header">
          <div className="research-assistant__top-row">
            <div className="research-assistant__badge-group">
              <Badge variant="orange" label={t('assistant.badge', 'Research Q&A')} />
              <Badge
                variant="neutral"
                label={API_KEY ? 'Live Research' : t('assistant.mode_cited', 'Cited Research Brief')}
              />
            </div>

            {messages.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                label={t('assistant.clear_btn', 'Clear')}
                onClick={handleReset}
              />
            )}
          </div>

          <Heading level={3} className="research-assistant__title">
            {t('assistant.title', 'Ask About the Method')}
          </Heading>
          <Text size="sm" color="secondary" display="block" className="research-assistant__subtitle">
            {t(
              'assistant.subtitle',
              'Pick a topic below or ask a question about ages 2–7 rhythm, reading readiness, and clock time.'
            )}
          </Text>
        </div>

        <div className="research-assistant__window" ref={scrollRef} aria-live="polite">
          {messages.length === 0 ? (
            <div className="research-assistant__empty">
              <p className="research-assistant__prompt-lead">
                {t('assistant.empty_state', 'Start with a question:')}
              </p>
              <div className="research-starter-list">
                {starterQuestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="research-starter-btn"
                    onClick={() => submitQuestion(item.question)}
                    disabled={isLoading}
                  >
                    <span>{item.question}</span>
                    <span className="research-starter-btn__arrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`research-msg ${msg.role}`}>
                <div>{msg.content}</div>
                {msg.source && (
                  <div className="research-msg__source">
                    <Badge variant="neutral" label={msg.source} />
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="research-msg assistant" aria-label="Loading answer">
              <div className="research-loading-dots">
                <span>•</span>
                <span>•</span>
                <span>•</span>
              </div>
            </div>
          )}
        </div>

        {messages.length > 0 && remainingStarters.length > 0 && !isLoading && (
          <div className="research-quick-followups" aria-label="Suggested follow-up questions">
            {remainingStarters.map((item) => (
              <button
                key={item.id}
                type="button"
                className="research-followup-chip"
                onClick={() => submitQuestion(item.question)}
              >
                {item.shortLabel}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="research-assistant__form">
          <div className="research-assistant__input-wrap">
            <TextInput
              type="text"
              label={t('assistant.placeholder', 'Ask about rhythm, reading, or clock time...')}
              isLabelHidden
              value={userQuestion}
              onChange={(val) => setUserQuestion(val)}
              placeholder={t(
                'assistant.placeholder',
                'Ask about rhythm, reading, or clock time...'
              )}
              isDisabled={isLoading}
              size="md"
              width="100%"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            isDisabled={isLoading || !userQuestion.trim()}
            label={t('assistant.ask_btn', 'Ask')}
          />
        </form>
      </div>
    </SoeAstryxTheme>
  );
};

export default ResearchAssistant;
