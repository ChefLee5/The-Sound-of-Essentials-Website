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
        aria-label="Direct message SOE on Instagram to get tracks instantly with no email"
      >
        <span className="dm-icon" role="img" aria-label="Chat Bubble">💬</span>
        <div className="dm-text">
          <strong>{t('listen.dmCtaTitle', 'Send to my Instagram (No Email Required)')}</strong>
          <small>{t('listen.dmCtaSubtitle', 'DM "RHYTHM" to @soelearn & get tracks instantly')}</small>
        </div>
      </a>
    </div>
  );
}
