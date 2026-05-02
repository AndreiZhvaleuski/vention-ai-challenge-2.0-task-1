import { memo } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';
import type { FilteredEmployee } from '../hooks/useLeaderboard';
import { colors } from '../theme';
import { TEST_IDS } from '../testIds';

interface PodiumPlace {
  rank: 1 | 2 | 3;
  badgeColor: string;
  avatarBadgeColor: string;
  avatarBorderColor: string;
  pedestalColor: string;
  pedestalHeight: number;
  avatarSize: number;
  pointsColor: string;
  pillBorderColor: string;
  pillBgColor: string;
}

// Render order desktop: [2nd, 1st, 3rd]
const PLACES: PodiumPlace[] = [
  { rank: 2, badgeColor: '#b8c6da', avatarBadgeColor: '#94a3b8', avatarBorderColor: '#ffffff', pedestalColor: 'linear-gradient(180deg, #eaeff8 0%, #d0d8ea 100%)', pedestalHeight: 180, avatarSize: 108, pointsColor: colors.accent, pillBorderColor: '#bfdbfe', pillBgColor: '#ffffff' },
  { rank: 1, badgeColor: '#f0cc40', avatarBadgeColor: '#eab308', avatarBorderColor: '#eab308', pedestalColor: 'linear-gradient(180deg, #fef9c3 0%, #fde047 100%)', pedestalHeight: 220, avatarSize: 136, pointsColor: '#b8860b', pillBorderColor: '#e9cc6a', pillBgColor: '#fef9c3' },
  { rank: 3, badgeColor: '#b8c6da', avatarBadgeColor: '#b87333', avatarBorderColor: '#ffffff', pedestalColor: 'linear-gradient(180deg, #eaeff8 0%, #d0d8ea 100%)', pedestalHeight: 150, avatarSize: 96, pointsColor: colors.accent, pillBorderColor: '#bfdbfe', pillBgColor: '#ffffff' },
];

// Render order mobile: [1st, 2nd, 3rd]
const PLACES_MOBILE: PodiumPlace[] = [
  { rank: 1, badgeColor: '#f0cc40', avatarBadgeColor: '#eab308', avatarBorderColor: '#eab308', pedestalColor: 'linear-gradient(180deg, #fef9c3 0%, #fde047 100%)', pedestalHeight: 72, avatarSize: 100, pointsColor: '#b8860b', pillBorderColor: '#e9cc6a', pillBgColor: '#fef9c3' },
  { rank: 2, badgeColor: '#b8c6da', avatarBadgeColor: '#94a3b8', avatarBorderColor: '#ffffff', pedestalColor: 'linear-gradient(180deg, #eaeff8 0%, #d0d8ea 100%)', pedestalHeight: 60, avatarSize: 88, pointsColor: colors.accent, pillBorderColor: '#bfdbfe', pillBgColor: '#ffffff' },
  { rank: 3, badgeColor: '#b8c6da', avatarBadgeColor: '#b87333', avatarBorderColor: '#ffffff', pedestalColor: 'linear-gradient(180deg, #eaeff8 0%, #d0d8ea 100%)', pedestalHeight: 52, avatarSize: 80, pointsColor: colors.accent, pillBorderColor: '#bfdbfe', pillBgColor: '#ffffff' },
];

const TOP3_INDEX: Record<1 | 2 | 3, number> = { 1: 0, 2: 1, 3: 2 };

interface Props {
  top3: FilteredEmployee[];
  filteredIds?: Set<string>;
}

export default memo(function PodiumSection({ top3, filteredIds }: Props) {
  if (top3.length === 0) return null;

  return (
    <PodiumSectionInner top3={top3} filteredIds={filteredIds} />
  );
});

function PodiumSectionInner({ top3, filteredIds }: Props) {
  return (
    <>
      {/* Mobile layout: stacked podium cards 1 → 2 → 3 */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 0, mb: 4 }}>
        {PLACES_MOBILE.map((place) => {
          const entry = top3[TOP3_INDEX[place.rank]];
          if (!entry) return null;
          if (filteredIds && !filteredIds.has(entry.employee.id)) return null;
          const { employee, totalPoints } = entry;
          const initials = `${employee.firstName[0]}${employee.lastName[0]}`;

          return (
            <Box
              key={place.rank}
              data-testid={TEST_IDS.PODIUM_ENTRY}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              {/* Avatar with rank badge */}
              <Box sx={{ position: 'relative', mb: 1, mt: place.rank === 1 ? 0 : 2 }}>
                <Avatar
                  src={employee.avatarUrlLarge}
                  slotProps={{ img: { loading: 'lazy' } }}
                  sx={{
                    bgcolor: employee.avatarColor,
                    width: place.avatarSize,
                    height: place.avatarSize,
                    fontSize: place.avatarSize * 0.35,
                    border: `3px solid ${place.avatarBorderColor}`,
                    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.25)',
                  }}
                >
                  {initials}
                </Avatar>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: place.rank === 1 ? 40 : 32,
                    height: place.rank === 1 ? 40 : 32,
                    borderRadius: '50%',
                    bgcolor: place.avatarBadgeColor,
                    border: '2px solid white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: place.rank === 1 ? 20 : 16,
                      fontWeight: 800,
                      color: place.rank === 1 ? '#7a5800' : 'white',
                      lineHeight: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    {place.rank}
                  </Typography>
                </Box>
              </Box>

              {/* Name */}
              <Typography
                variant="subtitle1"
                data-testid={TEST_IDS.PODIUM_NAME}
                sx={{ fontWeight: 700, textAlign: 'center', mb: 0.25 }}
              >
                {employee.firstName} {employee.lastName}
              </Typography>

              {/* Title */}
              <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center', mb: 1 }}>
                {employee.title} ({employee.department})
              </Typography>

              {/* Points pill */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 2,
                  py: 0.5,
                  borderRadius: 10,
                  bgcolor: place.pillBgColor,
                  border: '1px solid',
                  borderColor: place.pillBorderColor,
                  mb: 1.5,
                }}
              >
                <StarIcon sx={{ color: place.pointsColor, fontSize: 16 }} />
                <Typography sx={{ fontWeight: 700, color: place.pointsColor, fontSize: 15 }}>
                  {totalPoints}
                </Typography>
              </Box>

              {/* Pedestal */}
              <Box
                sx={{
                  width: { xs: '80%', sm: '50%', md: '80%' },
                  height: place.pedestalHeight,
                  background: place.pedestalColor,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  sx={{ fontSize: place.pedestalHeight * 0.55, fontWeight: 900, color: place.badgeColor, opacity: 0.5, lineHeight: 1, userSelect: 'none' }}
                >
                  {place.rank}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Desktop layout: podium (2nd, 1st, 3rd) */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'flex-end', gap: 2, mb: 4, width: '80%', mx: 'auto' }}>
        {PLACES.map((place) => {
          const entry = top3[TOP3_INDEX[place.rank]];
          if (!entry || (filteredIds && !filteredIds.has(entry.employee.id))) return null;
          const { employee, totalPoints } = entry;
          const initials = `${employee.firstName[0]}${employee.lastName[0]}`;

          return (
            <Box
              key={place.rank}
              data-testid={TEST_IDS.PODIUM_ENTRY}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto', width: '33%' }}
            >
              {/* Avatar with rank badge */}
              <Box sx={{ position: 'relative', mb: 1 }}>
                <Avatar
                  src={employee.avatarUrlLarge}
                  slotProps={{ img: { loading: 'lazy' } }}
                  sx={{
                    bgcolor: employee.avatarColor,
                    width: place.avatarSize,
                    height: place.avatarSize,
                    fontSize: place.avatarSize * 0.35,
                    border: `3px solid ${place.avatarBorderColor}`,
                    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.25)',
                  }}
                >
                  {initials}
                </Avatar>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: place.rank === 1 ? 40 : 32,
                    height: place.rank === 1 ? 40 : 32,
                    borderRadius: '50%',
                    bgcolor: place.avatarBadgeColor,
                    border: '2px solid white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: place.rank === 1 ? 19 : 15,
                      fontWeight: 800,
                      color: place.rank === 1 ? '#7a5800' : 'white',
                      lineHeight: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    {place.rank}
                  </Typography>
                </Box>
              </Box>

              {/* Name */}
              <Typography
                variant="subtitle1"
                data-testid={TEST_IDS.PODIUM_NAME}
                sx={{ fontWeight: 700, textAlign: 'center', mb: 0.25 }}
              >
                {employee.firstName} {employee.lastName}
              </Typography>

              {/* Title */}
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', textAlign: 'center', mb: 1 }}
              >
                {employee.title} ({employee.department})
              </Typography>

              {/* Points pill */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 2,
                  py: 0.5,
                  borderRadius: 10,
                  bgcolor: place.pillBgColor,
                  border: '1px solid',
                  borderColor: place.pillBorderColor,
                  mb: 1.5,
                }}
              >
                <StarIcon sx={{ color: place.pointsColor, fontSize: 22 }} />
                <Typography sx={{ fontWeight: 700, color: place.pointsColor, fontSize: 20 }}>
                  {totalPoints}
                </Typography>
              </Box>

              {/* Pedestal */}
              <Box
                sx={{
                  width: '100%',
                  height: place.pedestalHeight,
                  background: place.pedestalColor,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  sx={{ fontSize: 80, fontWeight: 900, color: place.badgeColor, opacity: 0.5, lineHeight: 1, userSelect: 'none' }}
                >
                  {place.rank}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
}
