import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';
import type { FilteredEmployee } from '../hooks/useLeaderboard';
import { colors } from '../theme';

interface PodiumPlace {
  rank: 1 | 2 | 3;
  badgeColor: string;
  avatarBadgeColor: string;
  pedestalColor: string;
  pedestalHeight: number;
  avatarSize: number;
  pointsColor: string;
  pillBorderColor: string;
  pillBgColor: string;
}

// Render order desktop: [2nd, 1st, 3rd]
const PLACES: PodiumPlace[] = [
  { rank: 2, badgeColor: '#94a3b8', avatarBadgeColor: '#94a3b8', pedestalColor: '#dce8f5', pedestalHeight: 150, avatarSize: 80, pointsColor: colors.accent, pillBorderColor: '#bfdbfe', pillBgColor: '#ffffff' },
  { rank: 1, badgeColor: '#c9a227', avatarBadgeColor: '#eab308', pedestalColor: '#fff9c4', pedestalHeight: 190, avatarSize: 104, pointsColor: '#b8860b', pillBorderColor: '#e9cc6a', pillBgColor: '#fef9c3' },
  { rank: 3, badgeColor: '#b87333', avatarBadgeColor: '#b87333', pedestalColor: '#e4edf8', pedestalHeight: 120, avatarSize: 72, pointsColor: colors.accent, pillBorderColor: '#bfdbfe', pillBgColor: '#ffffff' },
];

// Render order mobile: [1st, 2nd, 3rd]
const PLACES_MOBILE: PodiumPlace[] = [
  { rank: 1, badgeColor: '#c9a227', avatarBadgeColor: '#eab308', pedestalColor: '#fff9c4', pedestalHeight: 56, avatarSize: 80, pointsColor: '#b8860b', pillBorderColor: '#e9cc6a', pillBgColor: '#fef9c3' },
  { rank: 2, badgeColor: '#94a3b8', avatarBadgeColor: '#94a3b8', pedestalColor: '#dce8f5', pedestalHeight: 48, avatarSize: 72, pointsColor: colors.accent, pillBorderColor: '#bfdbfe', pillBgColor: '#ffffff' },
  { rank: 3, badgeColor: '#b87333', avatarBadgeColor: '#b87333', pedestalColor: '#e4edf8', pedestalHeight: 40, avatarSize: 64, pointsColor: colors.accent, pillBorderColor: '#bfdbfe', pillBgColor: '#ffffff' },
];

const TOP3_INDEX: Record<1 | 2 | 3, number> = { 1: 0, 2: 1, 3: 2 };

interface Props {
  top3: FilteredEmployee[];
}

export default function PodiumSection({ top3 }: Props) {
  if (top3.length === 0) return null;

  return (
    <>
      {/* Mobile layout: stacked podium cards 1 → 2 → 3 */}
      <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', gap: 0, mb: 4 }}>
        {PLACES_MOBILE.map((place) => {
          const entry = top3[TOP3_INDEX[place.rank]];
          if (!entry) return null;
          const { employee, totalPoints } = entry;
          const initials = `${employee.firstName[0]}${employee.lastName[0]}`;

          return (
            <Box
              key={place.rank}
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
                    border: place.rank === 1 ? `3px solid ${place.avatarBadgeColor}` : 'none',
                  }}
                >
                  {initials}
                </Avatar>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    bgcolor: place.avatarBadgeColor,
                    border: '2px solid white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography sx={{ fontSize: 12, fontWeight: 800, color: place.rank === 1 ? '#7a5800' : 'white', lineHeight: 1 }}>
                    {place.rank}
                  </Typography>
                </Box>
              </Box>

              {/* Name */}
              <Typography
                variant={place.rank === 1 ? 'subtitle1' : 'body2'}
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
                  width: 160,
                  height: place.pedestalHeight,
                  bgcolor: place.pedestalColor,
                  borderRadius: '8px 8px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  sx={{ fontSize: place.pedestalHeight * 0.55, fontWeight: 900, color: place.badgeColor, opacity: 0.45, lineHeight: 1, userSelect: 'none' }}
                >
                  {place.rank}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Desktop layout: podium (2nd, 1st, 3rd) */}
      <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'center', alignItems: 'flex-end', gap: 2, mb: 4 }}>
        {PLACES.map((place) => {
          const entry = top3[TOP3_INDEX[place.rank]];
          if (!entry) return null;
          const { employee, totalPoints } = entry;
          const initials = `${employee.firstName[0]}${employee.lastName[0]}`;

          return (
            <Box
              key={place.rank}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
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
                    border: place.rank === 1 ? `3px solid ${place.avatarBadgeColor}` : 'none',
                  }}
                >
                  {initials}
                </Avatar>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    bgcolor: place.avatarBadgeColor,
                    border: '2px solid white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography sx={{ fontSize: 13, fontWeight: 800, color: place.rank === 1 ? '#7a5800' : 'white', lineHeight: 1 }}>
                    {place.rank}
                  </Typography>
                </Box>
              </Box>

              {/* Name */}
              <Typography
                variant={place.rank === 1 ? 'subtitle1' : 'body2'}
                sx={{ fontWeight: 700, textAlign: 'center', maxWidth: place.rank === 1 ? 200 : 140, mb: 0.25 }}
              >
                {employee.firstName} {employee.lastName}
              </Typography>

              {/* Title */}
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: place.rank === 1 ? 160 : 130, mb: 1 }}
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
                <StarIcon sx={{ color: place.pointsColor, fontSize: 18 }} />
                <Typography sx={{ fontWeight: 700, color: place.pointsColor, fontSize: 16 }}>
                  {totalPoints}
                </Typography>
              </Box>

              {/* Pedestal */}
              <Box
                sx={{
                  width: 200,
                  height: place.pedestalHeight,
                  bgcolor: place.pedestalColor,
                  borderRadius: '8px 8px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  sx={{ fontSize: 80, fontWeight: 900, color: place.badgeColor, opacity: 0.35, lineHeight: 1, userSelect: 'none' }}
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
