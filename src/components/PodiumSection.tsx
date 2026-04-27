import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';
import type { FilteredEmployee } from '../hooks/useLeaderboard';

interface PodiumPlace {
  rank: 1 | 2 | 3;
  badgeColor: string;
  pedestalColor: string;
  pedestalHeight: number;
  avatarSize: number;
}

// Render order: [2nd, 1st, 3rd]
const PLACES: PodiumPlace[] = [
  { rank: 2, badgeColor: '#9e9e9e', pedestalColor: '#cfd8dc', pedestalHeight: 150, avatarSize: 80 },
  { rank: 1, badgeColor: '#FFD700', pedestalColor: '#fff9c4', pedestalHeight: 190, avatarSize: 104 },
  { rank: 3, badgeColor: '#a1887f', pedestalColor: '#eceff1', pedestalHeight: 120, avatarSize: 72 },
];

const TOP3_INDEX: Record<1 | 2 | 3, number> = { 1: 0, 2: 1, 3: 2 };

interface Props {
  top3: FilteredEmployee[];
}

export default function PodiumSection({ top3 }: Props) {
  if (top3.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 2, mb: 4 }}>
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
                sx={{
                  bgcolor: employee.avatarColor,
                  width: place.avatarSize,
                  height: place.avatarSize,
                  fontSize: place.avatarSize * 0.35,
                  border: place.rank === 1 ? `3px solid ${place.badgeColor}` : 'none',
                }}
              >
                {initials}
              </Avatar>
              {/* Rank badge */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  bgcolor: place.badgeColor,
                  border: '2px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  sx={{ fontSize: 13, fontWeight: 800, color: place.rank === 1 ? '#7a5800' : 'white', lineHeight: 1 }}
                >
                  {place.rank}
                </Typography>
              </Box>
            </Box>

            {/* Name */}
            <Typography
              variant={place.rank === 1 ? 'subtitle1' : 'body2'}
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                maxWidth: place.rank === 1 ? 200 : 140,
                mb: 0.25,
              }}
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
                bgcolor: 'white',
                border: '1px solid',
                borderColor: 'grey.200',
                mb: 1.5,
              }}
            >
              <StarIcon sx={{ color: '#0ea5e9', fontSize: 18 }} />
              <Typography sx={{ fontWeight: 700, color: '#0ea5e9', fontSize: 16 }}>
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
                sx={{
                  fontSize: 80,
                  fontWeight: 900,
                  color: place.badgeColor,
                  opacity: 0.35,
                  lineHeight: 1,
                  userSelect: 'none',
                }}
              >
                {place.rank}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
