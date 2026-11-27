import { lazy, Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { assetPath } from '../utils/assetPath';
import './AskSeriphiaModal.css';

const AskSeriphiaDialog = lazy(() => import('./AskSeriphiaDialog'));

export default function AskSeriphiaModal() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const launcherLabel = t('seriphia.launcher_text', 'Ask Seriphia');

  const handleOpen = () => {
    setHasOpened(true);
    setIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className="seriphia-launcher"
        onClick={handleOpen}
        aria-label={`${launcherLabel} — Open Curriculum Guide`}
      >
        <img
          src={assetPath('/assets/characters/SERIPHIA-320.webp')}
          alt=""
          aria-hidden="true"
          width="34"
          height="34"
          loading="lazy"
          decoding="async"
          className="seriphia-launcher__avatar"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <span>{launcherLabel}</span>
        <span className="seriphia-launcher__sparkle" aria-hidden="true">
          ✨
        </span>
      </button>

      {hasOpened && (
        <Suspense fallback={null}>
          <AskSeriphiaDialog isOpen={isOpen} onOpenChange={setIsOpen} />
        </Suspense>
      )}
    </>
  );
}
