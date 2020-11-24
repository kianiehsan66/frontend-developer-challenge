import React, { useEffect, useState } from 'react';
import { IconButton, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { AddEditVideoDialogProps } from './add-edit-video-dialog.interface';
import AddEditVideoDialog from './add-edit-video-dialog';
import { Video } from '../services/video.interface';
import { getVideos } from '../services/videos';

export const VideosTable: React.FC = () => {

  const handleCloseClick = () => {
    getVideos().then(handleVideosResponse);
    setOpen({ ...dialogState, isOpen: false });
  };

  const [dialogState, setOpen] = useState<AddEditVideoDialogProps>({ onClose: handleCloseClick, video: undefined, isOpen: false });

  const handleVideosResponse = (videos: Video[]) => {
    setVideos(videos);
  };

  useEffect(() => {
    getVideos().then(handleVideosResponse);
  }, []);
  const [videos, setVideos] = useState<Video[]>([]);


  const openAddVideoDialog = () => {
    setOpen({ ...dialogState, video: undefined, isOpen: true });
  };

  const openEditVideoDialog = (video: Video) => {
    setOpen({ ...dialogState, video, isOpen: true });
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <Button variant="contained" color="primary" onClick={openAddVideoDialog} startIcon={<AddIcon />}>
        Add New Movie
      </Button>
      <TableContainer component={Paper} style={{ marginTop: '40px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Video Name</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Categories</TableCell>
              <TableCell>Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell component="th" scope="row">
                  {video.name}
                </TableCell>
                <TableCell>{video.author}</TableCell>
                <TableCell>{video.categories.join(', ')}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openEditVideoDialog(video)} size="small">
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddEditVideoDialog {...dialogState} />
    </div>
  );
};
