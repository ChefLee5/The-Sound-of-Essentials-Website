import React, { useState } from 'react';
import { Badge } from '@astryxdesign/core/Badge';
import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { Layout, LayoutContent, Stack } from '@astryxdesign/core/Layout';
import { Text } from '@astryxdesign/core/Text';
import { trackReferralShare } from '../utils/analytics';
import { assetPath } from '../utils/assetPath';
import EmailDownloadGateModal from './EmailDownloadGateModal';
import SoeAstryxTheme from './SoeAstryxTheme';
import './GiftALandModal.css';

export const GiftALandModal = ({ isOpen, onClose, triggerLand = 'Harmonia' }) => {
  const [copied, setCopied] = useState(false);
  const [bonusUnlocked, setBonusUnlocked] = useState(false);
  const [isGateOpen, setIsGateOpen] = useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://thesoundofessentials.com';
  const shareUrl = `${origin}/listen?utm_source=referral&utm_medium=gift_a_land&utm_campaign=explorer_share`;
  const shareMessage = `Hey! We've been listening to The Sound of Essentials: Rhythm Quest with our kids — it's a completely free 19-track musical learning experience. Thought your family would love it: ${shareUrl}`;

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setBonusUnlocked(true);
      trackReferralShare({ channel: 'clipboard_copy', target: 'gift_a_land' });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(true);
      setBonusUnlocked(true);
      trackReferralShare({ channel: 'clipboard_copy_fallback', target: 'gift_a_land' });
    }
  };

  const handleWhatsAppShare = () => {
    setBonusUnlocked(true);
    trackReferralShare({ channel: 'whatsapp', target: 'gift_a_land' });
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'The Sound of Essentials: Free 19-Track Musical Quest',
          text: 'Free 19-track album for early learners!',
          url: shareUrl,
        });
        setBonusUnlocked(true);
        trackReferralShare({ channel: 'native_share', target: 'gift_a_land' });
      } catch {
        // user cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadBonus = () => {
    const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('soe_user_email') : null;
    if (storedEmail && storedEmail.includes('@')) {
      const link = document.createElement('a');
      link.href = assetPath('/assets/marketing/gabriel-coloring-sheet.webp');
      link.download = 'Gabriel-Secret-Bonus-Coloring-Sheet.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setIsGateOpen(true);
    }
  };

  const supportsNativeShare = typeof navigator !== 'undefined' && Boolean(navigator.share);

  return (
    <>
      <SoeAstryxTheme>
        <Dialog
          isOpen={isOpen}
          onOpenChange={(open) => {
            if (!open && onClose) onClose();
          }}
          width={500}
          purpose="info"
          aria-label="Harmonic Pioneer Badge Unlocked"
        >
          <Layout padding={6} gap={4}>
            <DialogHeader
              title="Harmonic Pioneer Badge Unlocked"
              subtitle={`You explored ${triggerLand}. Share the free 19-track album to unlock Gabriel's Secret Activity Sheet.`}
              startContent={
                <Badge variant="orange" label="Milestone Reached" icon={<span aria-hidden="true">🌟</span>} />
              }
              onOpenChange={(open) => {
                if (!open && onClose) onClose();
              }}
              hasDivider
            />

            <LayoutContent gap={4}>
              <Text size="sm" color="secondary">
                Gift this free 19-track album &amp; coloring pack to 2 fellow parents or teachers to unlock the{' '}
                <strong>Secret Gabriel Bonus Activity Sheet</strong>.
              </Text>

              <Card variant="muted" padding={3}>
                <Stack direction="vertical" gap={3}>
                  <Button
                    variant="primary"
                    size="lg"
                    width="100%"
                    label={copied ? '✅ Link Copied!' : '🔗 Copy 1-Click Gift Link'}
                    onClick={handleCopyLink}
                  />

                  <Button
                    variant="secondary"
                    size="lg"
                    width="100%"
                    label="💬 Share on WhatsApp"
                    onClick={handleWhatsAppShare}
                  />

                  {supportsNativeShare && (
                    <Button
                      variant="secondary"
                      size="lg"
                      width="100%"
                      label="📱 More Share Options"
                      onClick={handleNativeShare}
                    />
                  )}
                </Stack>
              </Card>

              {bonusUnlocked ? (
                <Banner
                  status="success"
                  title="🎁 Secret Bonus Unlocked!"
                  description="Gabriel's Secret Bonus Coloring Sheet is ready for your studio or classroom."
                  collapsible={false}
                  endContent={
                    <Button
                      variant="primary"
                      size="sm"
                      label="⬇️ Download Bonus Sheet"
                      onClick={handleDownloadBonus}
                    />
                  }
                />
              ) : (
                <Text size="xs" color="secondary" className="gift-modal-footer-note">
                  🔒 <em>Bonus unlocks automatically when you share with your friends.</em>
                </Text>
              )}
            </LayoutContent>
          </Layout>
        </Dialog>
      </SoeAstryxTheme>

      <EmailDownloadGateModal
        isOpen={isGateOpen}
        onClose={() => setIsGateOpen(false)}
        downloadItem={{
          title: 'Gabriel Secret Bonus Activity Sheet',
          filename: 'Gabriel-Secret-Bonus-Coloring-Sheet.png',
          url: assetPath('/assets/marketing/gabriel-coloring-sheet.webp'),
          kind: 'interest',
        }}
      />
    </>
  );
};

export default GiftALandModal;
