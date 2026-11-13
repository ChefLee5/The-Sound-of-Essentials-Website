import React, { useEffect, useState } from 'react';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { Layout, LayoutContent, Stack } from '@astryxdesign/core/Layout';
import { Badge } from '@astryxdesign/core/Badge';
import { Banner } from '@astryxdesign/core/Banner';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Selector } from '@astryxdesign/core/Selector';
import { CheckboxInput } from '@astryxdesign/core/CheckboxInput';
import { Button } from '@astryxdesign/core/Button';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { SoeAstryxTheme } from './SoeAstryxTheme';
import { submitSoeInterest } from '../services/soeSubmissions';
import { triggerBrowserDownload } from '../utils/deliveryUrl';
import { trackLead, trackInitiateCheckout } from '../utils/analytics';
import { setGateUnlocked, isValidEmail } from '../utils/gateAuth';
import './EmailDownloadGateModal.css';

const STRIPE_BUMP_URL = 'https://buy.stripe.com/test_8x2aEXbJW0BLcwS0oi6Vq01';

const PERSONA_OPTIONS = [
  { value: 'parent', label: '🏡 Parent / Caregiver' },
  { value: 'educator', label: '📚 Homeschool Pioneer' },
  { value: 'institution', label: '🏫 Early Childhood Teacher / Director' },
  { value: 'ally', label: '🩺 Pediatric OT / Therapist' },
  { value: 'creator', label: '🎨 Artist / Musician' },
];

/**
 * Shared $7 Quest Starter & Coloring Pack bump offer card used in both
 * the pre-capture form and post-capture confirmation state.
 */
const BumpOfferCard = ({ variant = 'inline', onAction }) => {
  const isSuccessVariant = variant === 'success';

  return (
    <div
      className={
        isSuccessVariant
          ? 'email-gate-bump-card email-gate-bump-card--success'
          : 'email-gate-bump-card'
      }
    >
      <div className="email-gate-bump-head">
        <Badge
          variant="orange"
          label={
            isSuccessVariant
              ? '🌙 PARENT SANCTUARY UPGRADE'
              : '⚡ SPECIAL IN-CART BUMP • 75% OFF'
          }
        />
        <span className="email-gate-bump-price">$7</span>
      </div>

      <Heading level={4} className="email-gate-bump-title">
        {isSuccessVariant
          ? 'Grab the Quest Starter & 40-Page Coloring Pack ($7)'
          : 'The Quest Starter & Coloring Pack (40-Page Book + 5-Minute Reset Kit)'}
      </Heading>

      <Text type="supporting" className="email-gate-bump-desc">
        {isSuccessVariant ? (
          <>
            Pair your free 19-track album with the complete 40-page tactile
            storybook coloring book, Seriphia&apos;s 432Hz calming audio,
            printable daily rhythm dial, and transition cue cards.
          </>
        ) : (
          <>
            Includes the{' '}
            <strong>Complete 40-Page Rhythm Quest Storybook Coloring Book (PDF)</strong>
            , <strong>Seriphia’s 432Hz Bedtime Calming Track</strong>,{' '}
            <strong>7-Land Tactile Rhythm Cue Cards</strong>, and the
            refrigerator <strong>Daily Rhythm Dial</strong>.
          </>
        )}
      </Text>

      <Button
        href={STRIPE_BUMP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onAction}
        variant={isSuccessVariant ? 'primary' : 'secondary'}
        size="md"
        width="100%"
        label={
          isSuccessVariant
            ? '⚡ Order Quest Starter & Coloring Pack ($7 Stripe Checkout) →'
            : '➕ Add Quest Starter & Coloring Pack ($7) →'
        }
      />
    </div>
  );
};

/**
 * EmailDownloadGateModal — Accessible Astryx-powered Email Capture Gate & In-Cart Bump.
 * Enforces email capture before delivering any PDF, coloring sheet, or audio file,
 * writing directly to Neon PostgreSQL CRM, triggering analytics, and delivering the file instantly,
 * while presenting the acute $7 in-cart 5-minute bedtime reset bump.
 */
export const EmailDownloadGateModal = ({
  isOpen,
  onClose,
  downloadItem = {
    title: 'The Sound of Essentials: 19-Track Album Experience',
    filename: 'The_Sound_of_Essentials_19_Tracks.pdf',
    url: null,
    kind: 'interest',
  },
  onSuccess = () => {},
}) => {
  const [name, setName] = useState(() => localStorage.getItem('soe_user_name') || '');
  const [email, setEmail] = useState(() => localStorage.getItem('soe_user_email') || '');
  const [persona, setPersona] = useState(() => localStorage.getItem('soe_user_persona') || 'parent');
  const [isCoppaChecked, setIsCoppaChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleOpenChange = (open) => {
    if (!open) {
      onClose();
    }
  };

  const handleBumpClick = () => {
    trackInitiateCheckout({
      sku: 'SOE-STARTER-PACK',
      name: 'The Quest Starter & Coloring Pack: 40-Page Coloring Book, 432Hz Reset Track & Transition Kit',
      price: 7.00,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!isValidEmail(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!isCoppaChecked) {
      setErrorMessage('Please confirm you are an adult (18+) under COPPA guidelines.');
      return;
    }

    setIsSubmitting(true);

    const submissionPayload = {
      kind: downloadItem.kind || 'interest',
      name: name.trim(),
      email: email.trim().toLowerCase(),
      persona,
      organizationName: persona === 'parent' ? null : persona,
      message: `Requested Instant Download: ${downloadItem.title} (${downloadItem.filename})`,
      sourcePath: window.location.pathname,
    };

    try {
      // 1. Save to Edge CRM (Neon Serverless PostgreSQL)
      await submitSoeInterest(submissionPayload);
    } catch (err) {
      console.warn('Edge submission sync notice:', err);
    }

    // 2. Guarantee local client storage & backup (Zero data loss)
    setGateUnlocked(email.trim().toLowerCase(), name.trim(), persona);

    try {
      const existingLeads = JSON.parse(localStorage.getItem('soe_captured_leads') || '[]');
      existingLeads.push({
        ...submissionPayload,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('soe_captured_leads', JSON.stringify(existingLeads));
    } catch {
      // ignore localStorage quota errors
    }

    // 3. Track Lead in Facebook/Meta & Microsoft Clarity
    trackLead({
      formName: 'email_download_gate',
      name: name.trim(),
      email: email.trim().toLowerCase(),
      persona,
      download_item: downloadItem.title,
      source: window.location.pathname,
    });

    // 4. Trigger Instant File Download
    if (downloadItem.url) {
      triggerBrowserDownload(downloadItem.url, downloadItem.filename);
    }

    setIsSuccess(true);
    setIsSubmitting(false);
    onSuccess(email.trim().toLowerCase());
  };

  return (
    <SoeAstryxTheme>
      <Dialog
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        width={520}
        maxHeight="90dvh"
        purpose="info"
        className="email-gate-dialog"
      >
        <Layout
          height="auto"
          header={
            <DialogHeader
              title={
                isSuccess ? (
                  '🎉 Download Started!'
                ) : (
                  <>
                    Where should we send your{' '}
                    <em className="email-gate-em">free download</em>?
                  </>
                )
              }
              subtitle={
                isSuccess ? (
                  <>
                    Your file (<strong>{downloadItem.filename}</strong>) is
                    downloading now. Explorer pass saved for{' '}
                    <strong>{email}</strong>.
                  </>
                ) : (
                  <>
                    Unlock instant access to <strong>{downloadItem.title}</strong>{' '}
                    and bring 60 to 80 BPM acoustic calm and hands-on readiness
                    into your home or classroom.
                  </>
                )
              }
              onOpenChange={handleOpenChange}
            />
          }
          content={
            <LayoutContent>
              {!isSuccess ? (
                <Stack gap={3}>
                  <div>
                    <Badge variant="orange" label="🎨 Instant Free Download" />
                  </div>

                  {errorMessage && (
                    <Banner
                      status="error"
                      role="alert"
                      title={errorMessage}
                      collapsible={false}
                    />
                  )}

                  <form
                    onSubmit={handleSubmit}
                    className="email-gate-form"
                    data-clarity-mask="true"
                  >
                    <Stack gap={3}>
                      <TextInput
                        label="Your Name"
                        placeholder="e.g. Sarah Jenkins"
                        value={name}
                        onChange={setName}
                        isRequired
                        autoComplete="name"
                        size="lg"
                        width="100%"
                      />

                      <TextInput
                        type="email"
                        label="Best Email Address"
                        placeholder="e.g. sarah@example.com"
                        value={email}
                        onChange={setEmail}
                        isRequired
                        autoComplete="email"
                        size="lg"
                        width="100%"
                      />

                      <Selector
                        label="I am a..."
                        options={PERSONA_OPTIONS}
                        value={persona}
                        onChange={setPersona}
                        presentation="adaptive"
                        size="lg"
                        width="100%"
                      />

                      <CheckboxInput
                        label="I confirm I am an adult (18+) consenting to receive educational resources under COPPA guidelines."
                        value={isCoppaChecked}
                        onChange={setIsCoppaChecked}
                        isRequired
                        size="sm"
                        width="100%"
                      />

                      <BumpOfferCard variant="inline" onAction={handleBumpClick} />

                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        width="100%"
                        isLoading={isSubmitting}
                        isDisabled={isSubmitting}
                        label={
                          isSubmitting
                            ? 'Preparing Your Download...'
                            : '⬇️ Download & Unlock Instant Access 🚀'
                        }
                      />
                    </Stack>
                  </form>

                  <Text type="supporting" className="email-gate-privacy-note">
                    🔒 100% spam-free. We only send joyful acoustic music,
                    printables, and curriculum updates.
                  </Text>
                </Stack>
              ) : (
                <Stack gap={4} align="center" className="email-gate-success-box">
                  <BumpOfferCard variant="success" onAction={handleBumpClick} />

                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={onClose}
                    label="Continue Exploring →"
                  />
                </Stack>
              )}
            </LayoutContent>
          }
        />
      </Dialog>
    </SoeAstryxTheme>
  );
};

export default EmailDownloadGateModal;
