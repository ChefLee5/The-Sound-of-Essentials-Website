import { useTranslation } from 'react-i18next';
import './DmOptInBridge.css';

export default function DmOptInBridge() {
  const { t } = useTranslation();

  return (
    <div className="dm-optin-bridge">
      <div className="dm-divider">
        <span>{t('listen.orDivider', 'OR')}</span>
      </div>
      <a 
        href="https://ig.me/m/soelearn?text=RHYTHM" 
        target="_blank" 
        rel="noopener noreferrer"
        className="dm-trigger-btn"
        id="dm-instagram-trigger"
        aria-label="Connect with SOE on Instagram to get tracks delivered in addition to email"
      >
        <span className="dm-icon" role="img" aria-label="Chat Bubble">💬</span>
        <div className="dm-text">
          <strong>{t('listen.dmCtaTitle', 'Also Connect via Instagram DM')}</strong>
          <small>{t('listen.dmCtaSubtitle', 'Get the 19 master tracks delivered to your Instagram in addition to email')}</small>
        </div>
      </a>
    </div>
  );
}
