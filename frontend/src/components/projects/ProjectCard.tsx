import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import { Project } from '../../services/projectService';

type ProjectCardProps = {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onClick?: () => void;
};

const ProjectCard = ({ project, onEdit, onDelete, onClick }: ProjectCardProps) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '10px',
        transition: 'all 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick
          ? {
              transform: 'translateY(-4px)',
              boxShadow: 6,
            }
          : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="flex-start" mb={2}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FolderRoundedIcon />
          </Box>
          <Box flex={1} minWidth={0}>
            <Typography variant="h6" fontWeight={600} noWrap>
              {project.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(project.createdAt).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Box>
        </Stack>

        {project.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 2,
            }}
          >
            {project.description}
          </Typography>
        )}

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip label="Активный" size="small" color="success" variant="outlined" />
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(project);
          }}
          sx={{ color: 'primary.main' }}
        >
          <EditRoundedIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project);
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteRoundedIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;

