import React, { } from 'react';
import { AppBar, Container, Toolbar, Typography } from '@material-ui/core';
import { VideosTable } from './components/videos-table';


const App: React.FC = () => {

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Video Manager</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <VideosTable />
      </Container>
    </>
  );
};

export default App;
