import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Layout from '../../components/layout/layout';
import routerService from '../../services/route.service';
import { withStyles, Slider, Typography, Button, LinearProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, makeStyles } from '@material-ui/core';
import mons from '../../services/microsoft-one-note.service';
import QuitDialog from './QuitDialog';
import Paper from '@material-ui/core/Paper';
import './_timer.scss';

import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
});

export default (props: any) => {
  let [sliderValue, setSliderValue] = useState(30);
  let [isTicking, setTicking] = useState(false);
  let [timeLeft, setTimeLeft] = useState();
  let [timeLeftPercent, setTimeLeftPercent] = useState(0);
  let [openQuitDialog, setQuitDialog] = useState(false);
  let [rows, setRows]: [any[], any] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalMinutes, setTotalMinutes] = useState();
  const [revisionMode, setRevisionMode] = useState(false);
  const [timeElapsedTxt, setTimeElapsedTxt] = useState('');

  const startMillis = useRef(new Date());
  const sliderValueRef = useRef(30);
  const counterIntervalRef: any = useRef();
  const pageDetails: any = useRef();
  const revisionClicked = useRef(false);

  const classes = useStyles();

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const pageUrl = params.get('pageUrl');

    if (pageUrl) {
      mons.getPage(pageUrl).then((_pageDetails: any) => {
        pageDetails.current = _pageDetails;

        return mons.getAllDBRows().then((rows: any[]) => {
          let _totalMinutes = 0;
          const _rows: any = [];

          rows.forEach(row => {
            if (pageDetails?.current.title === row.title) {
              _totalMinutes += row.minutesSpentLearning;
              _rows.push(row);
            }
          });

          setTotalMinutes(_totalMinutes);
          setRows(_rows);
        });
      }).finally(() => {
        setLoading(false);
      });
    } else {
      routerService.goTo(routerService.getHomeRoute()['name'].toLowerCase());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const PrettoSlider = withStyles({
    root: {
      color: 'rgb(246, 1, 87)',
      height: 8,
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      marginTop: -8,
      marginLeft: -12,
      '&:focus,&:hover,&$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 4px)',
    },
    track: {
      height: 8,
      borderRadius: 4,
    },
    rail: {
      height: 8,
      borderRadius: 4,
    },
  })(Slider);

  const getTimeLeftTxt = (totalMillis: number) => {
    const millisElapsedSinceStart = Date.now() - startMillis.current.getTime();;
    const millisLeft = totalMillis - millisElapsedSinceStart;
    let totalSecondsLeft = millisLeft / (1000);
    let minutesLeft = Math.trunc(totalSecondsLeft / 60);
    let secondsLeft = Math.ceil(totalSecondsLeft - (minutesLeft * 60));
    return `${minutesLeft} minutes and ${secondsLeft} seconds left`;
  };

  const getPercentTimeLeft = (totalMillis: number) => {
    const millisElapsedSinceStart = Date.now() - startMillis.current.getTime();
    const millisLeft = totalMillis - millisElapsedSinceStart;
    return (millisLeft / totalMillis) * 100;
  };

  const getRowDetails = (totalMillisSpeantLeaning: number, totalMillis: number) => {
    const startDate = `${startMillis.current.getMonth() + 1}/${startMillis.current.getDate()}/${startMillis.current.getFullYear()}`;
    const startTime = `${startMillis.current.getHours()}:${startMillis.current.getMinutes()}:${startMillis.current.getSeconds()}`;

    return {
      startDate,
      startTime,
      title: pageDetails.current.title,
      totalSessionMinutes: totalMillis / (60000),
      minutesSpentLearning: totalMillisSpeantLeaning / (60000),
      repetition: false,
      pageId: pageDetails.current.id,
      sectionName: pageDetails.current.parentSection.displayName,
      sectionId: pageDetails.current.parentSection.id
    };
  };

  const stopTimer = useCallback(() => {
    const totalMillis = sliderValueRef.current * 60 * 1000;
    const totalMillisSpeantLeaning = (Date.now() - startMillis.current.getTime());
    const rowDetails = getRowDetails(totalMillisSpeantLeaning, totalMillis);

    // Update one note page which tracks learning
    mons.updateOneNoteDB(rowDetails).then(() => {
      setRows((rows: any) => [...rows, { ...rowDetails, repetition: 'No' }]);
    });

    clearInterval(counterIntervalRef.current);
    setTicking(false);
    // Store time spent studying 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startTimer = useCallback(() => {
    // Start timer 
    const totalMillis = sliderValueRef.current * 60 * 1000;
    startMillis.current = new Date();

    setTimeLeft(getTimeLeftTxt(totalMillis));
    setTimeLeftPercent(getPercentTimeLeft(totalMillis));

    counterIntervalRef.current = setInterval(() => {
      setTimeLeft(getTimeLeftTxt(totalMillis));
      setTimeLeftPercent(getPercentTimeLeft(totalMillis));

      const millisElapsedSinceStart = Date.now() - startMillis.current.getTime();

      if (millisElapsedSinceStart >= totalMillis) {
        stopTimer();
      }
    }, 1000);

    setTicking(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const studyHistory = (
    rows.length > 0 ?
      (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center"></TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Time</TableCell>
                <TableCell align="center">Minutes spent</TableCell>
                <TableCell align="center">Total session minutes</TableCell>
                <TableCell align="center">Repetition</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow style={row.minutesSpentLearning < row.totalSessionMinutes ? { backgroundColor: '#faa1be', opacity: 0.8 } : { position: 'static' }} key={index}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{row.startDate}</TableCell>
                  <TableCell align="center">{row.startTime}</TableCell>
                  <TableCell align="center">{row.minutesSpentLearning}</TableCell>
                  <TableCell align="center">{row.totalSessionMinutes}</TableCell>
                  <TableCell align="center">{row.repetition}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : <Typography variant="h6" component="h6" color="textSecondary" gutterBottom>Nothing to display</Typography>
  );

  const toggleRevisionMode = (name: any) => (event: any) => {
    if (isTicking) {
      revisionClicked.current = true;
      setQuitDialog(true)
    } else {
      setRevisionMode(isRevisionMode => !isRevisionMode);
    }
  };

  const getRevisionTime = () => {
    const seconds = Math.trunc((Date.now() - startMillis.current.getTime()) / 1000);
    const minutes = Math.trunc(seconds / 60);
    return {
      minutes,
      seconds
    };
  };

  const getTimeElapsedTxt = () => {
    const time = getRevisionTime();
    return `Time Elapsed - ${time.minutes > 0 ? time.minutes + " minutes and " : ''}${time.seconds % 60} seconds`;
  };

  const checkAndSetRevisionMode = () => {
    if (!revisionMode) {
      // Revision started
      revisionClicked.current = false;
      setRevisionMode(true);

      if (isTicking) {
        stopTimer();
      }
    } else {
      // Revision Ended
      clearInterval(counterIntervalRef.current);
      const revisionTime = getRevisionTime();
      const totalMillisSpeantLeaning = ((revisionTime.minutes * 60) + revisionTime.seconds) * 1000;
      const rowDetails = getRowDetails(totalMillisSpeantLeaning, totalMillisSpeantLeaning);
      rowDetails.repetition = true;

      // Update one note page which tracks learning
      mons.updateOneNoteDB(rowDetails).then(() => {
        setRows((rows: any) => [...rows, { ...rowDetails, repetition: 'Yes' }]);
      });
    }
  };

  const revisionSwitch = (
    <>
      <FormControl className="revision-switch" component="fieldset">
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={revisionMode} onChange={toggleRevisionMode('revisionMode')} value="gilad" />}
            label="Revision Mode" />
        </FormGroup>
      </FormControl>
      <br />
    </>
  );

  const revisionModeHeader = (
    <Typography variant="h5" component="h6" gutterBottom>{pageDetails.current && pageDetails.current.title}</Typography>
  );

  const studyModeHeader = (
    !isTicking ?
      <Typography variant="h5" component="h6" gutterBottom>Study {pageDetails.current && `"${pageDetails.current.title}"`} for {sliderValue} Minutes</Typography> :
      <Typography variant="h5" component="h6" gutterBottom>{pageDetails.current && `"${pageDetails.current.title}"`}: {timeLeft}</Typography>
  );

  const studyModeSlider = useMemo(() => (
    <>
      <div style={{
        minHeight: '45px',
        paddingTop: isTicking ? '15px' : '0px',
        paddingBottom: isTicking ? '15px' : '0px'
      }}>
        {
          !isTicking ? <PrettoSlider
            onChange={(event, value) => {
              sliderValueRef.current = Number(value);
              setSliderValue(sliderValueRef.current);
            }}
            valueLabelDisplay="auto"
            aria-label="pretto slider"
            min={1}
            step={1}
            max={90}
            defaultValue={sliderValueRef.current} /> :
            <LinearProgress
              variant="buffer"
              value={100 - timeLeftPercent}
              valueBuffer={0}
              color="secondary"
            />
        }
      </div>
    </>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [isTicking, rows, timeLeftPercent]);

  const checkAndStartTimer = () => {
    if (revisionMode) {
      startMillis.current = new Date();

      counterIntervalRef.current = setInterval(() => {
        setTimeElapsedTxt(getTimeElapsedTxt());
      }, 1000);
    } else {
      startTimer();
    }
    setTicking(true);
  };

  const timerButtons = (
    !isTicking ?
      (<Button onClick={() => { checkAndStartTimer() }} variant="contained" color="primary">Start</Button>) :
      (<Button onClick={() => {
        setQuitDialog(true)
      }} variant="contained" color="primary">{revisionMode ? 'Stop' : 'Quit'}</Button>)
  );

  const revisionModeHeader = (
    <>
      <Typography className="revision-mode-header" variant="h5" component="h6" gutterBottom>
        {pageDetails.current && pageDetails.current.title}{isTicking? `, ${timeElapsedTxt}`: null}</Typography>
    </>
  );

  const onQuit = () => {
    if (revisionClicked.current || revisionMode) {
      checkAndSetRevisionMode();
    } else {
      stopTimer();
    }
    setQuitDialog(false);
    setTicking(false);
  };

  return (
    <>
      <Layout hideNavDrawer={true} routeInfo={routerService.getRouteInfo('timer')}>
        {/*Quit Dialog*/}
        <QuitDialog open={openQuitDialog} onClose={() => {
          revisionClicked.current = false;
          setQuitDialog(false)
        }} onQuit={onQuit} isRevision={revisionMode}></QuitDialog>

        {revisionSwitch}
        {revisionMode ? revisionModeHeader : studyModeHeader}
        {revisionMode ? null : studyModeSlider}
        {revisionMode ? revisionModeHeader : null}
        {timerButtons}

        <div className="table-cntr">
          <Typography variant="h5" component="h6" gutterBottom>
            Learning history{totalMinutes ? `: ${Math.ceil(totalMinutes)} minutes spent learning` : null}
          </Typography>
          {
            loading ? <LinearProgress color="secondary" /> : studyHistory
          }
        </div>
      </Layout>
    </>
  );
}; 