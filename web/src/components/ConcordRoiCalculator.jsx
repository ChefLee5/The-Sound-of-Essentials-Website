import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@astryxdesign/core/Badge';
import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Heading } from '@astryxdesign/core/Heading';
import { Stack } from '@astryxdesign/core/Layout';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Slider } from '@astryxdesign/core/Slider';
import { Text } from '@astryxdesign/core/Text';
import SoeAstryxTheme from './SoeAstryxTheme';
import './ConcordRoiCalculator.css';

export default function ConcordRoiCalculator({ initialMode = 'school' }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState(initialMode); // 'school' | 'family'
  const [units, setUnits] = useState(mode === 'school' ? 4 : 2); // classrooms or children
  const [referrals, setReferrals] = useState(3); // fellow schools or families referred

  // Mode calculations
  const isSchool = mode === 'school';

  // Benchmark metrics
  // Commercial app average: $4,500 / classroom / yr or $240 / child / yr
  // SOE tactile & music curriculum: $1,200 / classroom / yr or $75 / child one-time prep
  const commercialAnnualCost = isSchool ? units * 4500 : units * 240;
  const soeAnnualCost = isSchool ? units * 1200 : units * 75;
  const netSavings = Math.max(0, commercialAnnualCost - soeAnnualCost);

  // "Share the Sound" Ambassador Referral Bounty (30% - 35%)
  // Average referral cart size: $1,200 (school) or $120 (family bundle)
  const avgReferralVolume = isSchool ? referrals * 1200 : referrals * 120;
  const referralBountyRate = 0.35; // 35% bounty
  const annualBountyEarnings = Math.round(avgReferralVolume * referralBountyRate);

  // Concord 25% Master Catalog Royalty Pool contribution / value
  // Illustrates community reinvestment back to educators & acoustic storytellers
  const catalogPoolShare = Math.round(soeAnnualCost * 0.25);

  return (
    <SoeAstryxTheme>
      <div className="concord-roi-calculator" aria-label="Concord Curriculum ROI Calculator">
        <div className="roi-header">
          <div style={{ marginBottom: '0.75rem' }}>
            <Badge
              variant="orange"
              label={t('roi.pill', 'The Concord Financial Model • 4-Pillar Efficiency')}
              icon={<span className="pulse-disc" aria-hidden="true" />}
            />
          </div>
          <Heading level={3}>{t('roi.heading', 'Early Learning Impact & ROI Calculator')}</Heading>
          <Text size="md" color="secondary" display="block">
            {t(
              'roi.subheading',
              'Compare the cost of screen-heavy digital subscriptions against our turnkey, acoustic-powered physical curriculum for ages 2–7.'
            )}
          </Text>
        </div>

        {/* Mode Switcher */}
        <div style={{ maxWidth: '480px', margin: '0 auto 1.75rem' }}>
          <SegmentedControl
            label="Select institution type"
            value={mode}
            onChange={(nextMode) => {
              setMode(nextMode);
              setUnits(nextMode === 'school' ? 4 : 2);
            }}
            layout="fill"
            size="md"
          >
            <SegmentedControlItem
              value="school"
              label={t('roi.mode_school', 'Preschool / Daycare Center')}
              icon={<span aria-hidden="true">🏫</span>}
            />
            <SegmentedControlItem
              value="family"
              label={t('roi.mode_family', 'Homeschool Pod / Family')}
              icon={<span aria-hidden="true">🏡</span>}
            />
          </SegmentedControl>
        </div>

        {/* Interactive Controls */}
        <Stack direction="vertical" gap={4} style={{ marginBottom: '1.75rem' }}>
          <Slider
            label={
              isSchool
                ? t('roi.classrooms_label', 'Active Classrooms (Ages 2–7)')
                : t('roi.children_label', 'Children (Ages 2–7)')
            }
            description={
              isSchool
                ? t('roi.classrooms_hint', 'Typical center: 3–8 classrooms')
                : t('roi.children_hint', 'Average homeschool pod: 2–5 children')
            }
            min={1}
            max={isSchool ? 30 : 8}
            step={1}
            value={units}
            onChange={setUnits}
            valueDisplay="text"
            formatValue={(v) =>
              `${v} ${isSchool ? (v === 1 ? 'Room' : 'Rooms') : v === 1 ? 'Child' : 'Children'}`
            }
            width="100%"
          />

          <Slider
            label={t('roi.referrals_label', 'Community Referrals ("Share the Sound")')}
            description={t('roi.referrals_hint', 'Fellow educators or families invited to the curriculum')}
            min={0}
            max={isSchool ? 20 : 15}
            step={1}
            value={referrals}
            onChange={setReferrals}
            valueDisplay="text"
            formatValue={(v) => `${v} ${t('roi.partners', 'Partners')}`}
            width="100%"
          />
        </Stack>

        {/* Three Core Metric Cards */}
        <div className="roi-metrics-grid">
          <Card variant="green" padding={4} className="roi-metric-card savings">
            <div className="roi-metric-icon">💰</div>
            <div className="roi-metric-label">{t('roi.metric_savings_label', 'Direct Annual Savings')}</div>
            <div className="roi-metric-value">${netSavings.toLocaleString()}</div>
            <div className="roi-metric-subtext">
              {t('roi.metric_savings_sub', 'vs. recurring commercial digital app subscriptions')}
            </div>
          </Card>

          <Card variant="orange" padding={4} className="roi-metric-card bounty">
            <div className="roi-metric-icon">🤝</div>
            <div className="roi-metric-label">{t('roi.metric_bounty_label', 'Share the Sound Bounty')}</div>
            <div className="roi-metric-value">${annualBountyEarnings.toLocaleString()}</div>
            <div className="roi-metric-subtext">
              {t('roi.metric_bounty_sub', '35% automated partner distribution directly to your program')}
            </div>
          </Card>

          <Card variant="purple" padding={4} className="roi-metric-card pool">
            <div className="roi-metric-icon">🏛️</div>
            <div className="roi-metric-label">{t('roi.metric_pool_label', 'Concord Community Pool')}</div>
            <div className="roi-metric-value">${catalogPoolShare.toLocaleString()}</div>
            <div className="roi-metric-subtext">
              {t('roi.metric_pool_sub', '25% of catalog revenue reinvested into acoustic artist & educator grants')}
            </div>
          </Card>
        </div>

        {/* Financial Leverage Formula Explainer */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Banner
            status="info"
            title={`💡 ${t('roi.formula_title', 'Sovereign Capital Efficiency (The 4-Pillar Formula)')}`}
            description={t(
              'roi.formula_body',
              'Instead of renting digital screen-time that depletes attention, SOE empowers you to invest once into tangible acoustic workbooks, picture dictionaries, and 432Hz calming music. With automated 35% "Share the Sound" bounties and 100% eligibility for Title I, Head Start ELOF, and State ESA funding, your program becomes a self-funding learning sanctuary.'
            )}
          />
        </div>

        {/* Action Footer */}
        <div className="roi-footer-actions">
          <div className="roi-disclaimer">
            {t('roi.disclaimer', '*Estimates based on national early learning benchmarks. 100% compliant with NAEYC and ELOF standards for ages 2–7.')}
          </div>
          <Button
            variant="primary"
            size="md"
            href="/solutions"
            label={t('roi.cta_btn', 'Explore Institutional Solutions →')}
          />
        </div>
      </div>
    </SoeAstryxTheme>
  );
}
