import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Checkbox,
  DialogTitle,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  makeStyles,
  createStyles,
  FormControl,
  Theme,
  ListSubheader,
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';

import { AddEditVideoDialogProps } from './add-edit-video-dialog.interface';
import { Category } from './../services/category.interface';

import { Author } from '../services/author.interface';
import { getAuthors, putAuthor } from '../services/authors';
import { getCategories } from '../services/categories';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
      maxWidth: 300,
    },
    nested: {
      paddingLeft: theme.spacing(0),
    }
  }),
);

const AddEditVideoDialog: React.FC<AddEditVideoDialogProps> = (dialogProps) => {
  const [dialogTitle, setDialogTitle] = useState('Add Video');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [authorsList, authorsListSet] = useState<Author[]>([]);
  const [categoriesList, categoriesListSet] = useState<Category[]>([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([0]);

  const classes = useStyles();

  useEffect(() => {
    Promise.all([getCategories(), getAuthors()]).then(([categories, authors]) => {
      authorsListSet(authors);
      categoriesListSet(categories);
    });
  }, []);

  useEffect(() => {

    setIsDialogOpen(dialogProps.isOpen);

    if (dialogProps.video) {
      setDialogTitle(`Edit "${dialogProps.video.name}"`);
      setVideoTitle(dialogProps.video.name);
      //setting author "select" value based on injected video
      const authorId = authorsList.find((author) => (author.name === dialogProps.video?.author))?.id;
      if (authorId) {
        setSelectedAuthorId(authorId.toString());
      }
      //setting categories "list" value based on injected video
      const categoryIds = categoriesList.filter((category) => (dialogProps.video?.categories.includes(category.name))).map(category => category.id);
      setSelectedCategories(categoryIds);
    }
    else {
      setVideoTitle('');
      setSelectedAuthorId('');
      setSelectedCategories([]);
    }

  }, [dialogProps, authorsList, categoriesList]);


  const highestVideoId = () => {
    var highestId = 0;
    authorsList.forEach(author => {
      author.videos.forEach(video => {
        if (video.id > highestId) {
          highestId = video.id;
        }
      });
    });
    return highestId;
  }
  const updateVideo = () => {
    let selectedAuthor = authorsList.find(a => a.id === Number.parseInt(selectedAuthorId));
    if (!selectedAuthor)
      return;
    if (selectedAuthor?.name === dialogProps.video?.author)//if author did not change
    {
      const editingVideo = selectedAuthor?.videos.find(video => video.id === dialogProps.video?.id);
      if (editingVideo) {
        editingVideo.catIds = selectedCategories;
        editingVideo.name = videoTitle;
        putAuthor(selectedAuthor).then(responseAuthor => {
          selectedAuthor = responseAuthor;
          dialogProps.onClose();
        });
      }
    }
    else //if author did change
    {
      let previousAuthor = authorsList.find(a => a.name === dialogProps.video?.author);
      if (!previousAuthor) return;

      const previousAuthorVideos = previousAuthor?.videos.filter(aa => aa.id !== dialogProps.video?.id);
      if (!previousAuthorVideos) return;
      previousAuthor.videos = previousAuthorVideos;
      putAuthor(previousAuthor).then(responseAuthor => {
        previousAuthor = responseAuthor;
        dialogProps.onClose();
      });
      if (dialogProps.video?.id)
        selectedAuthor.videos.push({ id: dialogProps.video?.id, catIds: selectedCategories, name: videoTitle });
      putAuthor(selectedAuthor).then(responseAuthor => {
        selectedAuthor = responseAuthor;
      });
    }
  }
  const addVideo = () => {
    let selectedAuthor = authorsList.find(author => author.id === Number.parseInt(selectedAuthorId));
    selectedAuthor?.videos.push({ id: highestVideoId() + 1, name: videoTitle, catIds: selectedCategories });
    if (selectedAuthor)
      putAuthor(selectedAuthor).then(responseAuthor => {
        selectedAuthor = responseAuthor;
        dialogProps.onClose();
      });
  }
  const handleSave = () => {
    setIsDialogOpen(false);
    if (dialogProps.video && dialogProps.video?.id > 0) {
      updateVideo();
    }
    else {
      addVideo();
    }
  };
  const handleCancel = () => {
    setIsDialogOpen(false);
  };
  const handleToggle = (value: number) => () => {
    const currentIndex = selectedCategories.indexOf(value);
    const newChecked = [...selectedCategories];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedCategories(newChecked);
  };
  const handleSelectAuthor = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedId = event.target.value as string;
    setSelectedAuthorId(selectedId);
  };
  const createListItem = (category: Category) => {
    const labelId = `checkbox-list-label-${category.id}`;
    return (
      <ListItem key={category.id} role={undefined} dense button onClick={handleToggle(category.id)}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={selectedCategories.indexOf(category.id) !== -1}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemIcon>
        <ListItemText id={labelId} primary={category.name} />
      </ListItem>
    );
  };

  return (
    <Dialog open={isDialogOpen} fullWidth={true} aria-labelledby="form-dialog-title">

      <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
      <DialogContent>
        <FormControl className={classes.formControl} >
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Video name"
            type="text"
            fullWidth
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
          />
        </FormControl>
        <br />
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Author</InputLabel>
          <Select labelId="demo-simple-select-label"
            id="demo-simple-select" onChange={handleSelectAuthor} value={selectedAuthorId}>
            {authorsList?.map((author) => (
              <MenuItem key={author.id} value={author.id}>
                {author.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <FormControl required className={classes.formControl}>
          <List subheader={
            <ListSubheader className={classes.nested} component="div" id="nested-list-subheader">
              Categories
        </ListSubheader>
          }>{categoriesList?.map((category) => createListItem(category))}</List>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={handleSave}
          color="primary">
          Save
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default AddEditVideoDialog;
