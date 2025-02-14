"use client"
import React, { useEffect, useState } from "react";
import styles from "../app/page.module.css";
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Alert, Button, IconButton, Paper, Snackbar, ThemeProvider } from "@mui/material";
import { Cancel, CheckCircle, People, Settings as SettingsIcon } from '@mui/icons-material';
import { FormatListBulleted as FormatListBulletedIcon } from '@mui/icons-material';
import { FitnessCenter as FitnessCenterIcon } from '@mui/icons-material';
import { NoteAdd as NoteAddIcon } from '@mui/icons-material';
import { AppContext } from "./AppContext.js";
import { Menu } from "./components/Menu";
import ResponsiveAppBar from "./components/AppBar";
import theme from "./theme";
import { routeToComp } from './routes/index'
import { AppProvider } from './AppProvider'


function QuestionBox() {
  const { questionBox: { setIsQuestionBoxOpen, isQuestionBoxOpen, questionBoxMessage, onQuestionBoxAnswer } } = React.useContext(AppContext)
  return <Snackbar
    // open={isQuestionBoxOpen}
    onClose={() => setIsQuestionBoxOpen(false)}
  >
    <Alert
      onClose={() => setIsQuestionBoxOpen(false)}
      severity="info"
      sx={{ width: '100%' }}
      action={
        <>
          <IconButton onClick={() => onQuestionBoxAnswer(true)}>
            <CheckCircle />
          </IconButton>
          <IconButton onClick={() => onQuestionBoxAnswer(false)}>
            <Cancel />
          </IconButton>

        </>
      }
    >
      {questionBoxMessage}
    </Alert>
  </Snackbar >
}
function FloaingAlert() {
  const { isErrorAlertOpen, isAlertOpen, closeAlert, alertMessage } = React.useContext(AppContext)

  return <Snackbar
    open={isAlertOpen || isErrorAlertOpen}
    autoHideDuration={6000}
    onClose={() => closeAlert(false)}

  >
    <Alert
      onClose={() => closeAlert(false)}
      severity={isErrorAlertOpen ? 'error' : 'success'}
      variant="filled"
      sx={{ width: '100%' }}
    >
      {alertMessage}
    </Alert>
  </Snackbar>

}
export function Home({ user }) {
  // console.log({ user });
  const [menuOpen, setMenuOpen] = React.useState(false)
  const toggleDrawer = () => {
    setMenuOpen(!menuOpen)
  }


  const getComponent = (route) => {
    // console.log({ route });

    return routeToComp[route || 'main']
  }


  const Comps = [
    { label: "Workouts", route: 'main', icon: <FitnessCenterIcon /> },

  ]
  const [route, setValue] = React.useState('');

  function setInernalRoute(route, params) {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location);
    url.search = '';
    url.searchParams.set("route", route);

    if (params) {
      for (const key in params) {
        url.searchParams.set(key, params[key]);
      }
    }

    history.pushState({}, '', url.toString());
    setValue(route);
  }

  function setRoute(newValue) {
    const route = Comps[newValue].route;
    setInernalRoute(route)
  }

  function getParams() {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location);
    const params = {};
    for (const key of url.searchParams.keys()) {
      params[key] = url.searchParams.get(key);
    }
    return params;
  }

  useEffect(() => {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.register('/service-worker.js')
      // .then(reg => console.log('Service Worker registered:', reg))
      // .catch(err => console.error('Service Worker registration failed:', err));
    }
  }, []);


  useEffect(() => {
    window.addEventListener('popstate', function (event) {
      const url = new URL(window.location)
      const routeParam = url.searchParams.get("route")
      if (routeParam) {
        setValue(routeParam);
      }
    })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location);
    const routeParam = url.searchParams.get("route");
    if (routeParam) {
      return setValue(routeParam);
    } else {
      return setValue('')

      // const trainingPlans = localStorageAPI().getData('trainingPlans')
      // const isTrainingPlanExist = trainingPlans && trainingPlans.length > 0
      // if (isTrainingPlanExist) {
      //   return setValue('workouts')
      // } else {
      //   return setValue('training_plans')
      // }
    }
  }, [route])

  // const CompToRender = dynamic(() => Promise.resolve(getComponent(route)), { ssr: false })
  const CompToRender = getComponent(route)



  return (<main className={styles.main}>

    <ThemeProvider theme={theme}>

      <AppProvider
        setRoute={setInernalRoute}
        params={getParams()}
        user={user}
      >
        <div>
          <ResponsiveAppBar
            toggleDrawer={toggleDrawer}
          />
          <CompToRender />
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60px',
          }}>
          </div>
        </div>
        {/* <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <Box sx={{
            minWidth: 380,
            marginBottom: '10px',
          }}>
            <BottomNavigation
              showLabels
              value={Comps.findIndex(({ route: r }) => r === route)}
              onChange={(event, newValue) => setRoute(newValue)}
              sx={{
                backgroundColor: theme.colors.footer,
                // color: 'white'
              }}
            >
              {
                Comps.map(({ label, icon }, index) => (
                  <BottomNavigationAction
                    sx={{
                      padding: '0px',
                      // color: 'white'
                    }}
                    key={index} label={label} icon={icon} />
                ))
              }
            </BottomNavigation>
          </Box>
        </Paper> */}
        <FloaingAlert />
        <Menu onRouteChanged={setInernalRoute} menuOpen={menuOpen} toggleDrawer={toggleDrawer} />
      </AppProvider>
    </ThemeProvider >
  </main >
  );
}


