import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Layout from '../../components/layout/layout';
import routerService from '../../services/route.service';
import { withStyles, Slider, Typography, Button, LinearProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, makeStyles } from '@material-ui/core';
import mons from '../../services/microsoft-one-note.service';
import QuitDialog from './QuitDialog';
import Paper from '@material-ui/core/Paper';
import './_timer.scss';

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

  const startMillis = useRef(new Date());
  const sliderValueRef = useRef(30);
  const counterIntervalRef: any = useRef();
  const pageDetails = useRef({title: ''});

  const classes = useStyles();

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const pageUrl = params.get('pageUrl');

    if (pageUrl) {
      mons.getPage(pageUrl).then((_pageDetails: any) => {
        pageDetails.current = _pageDetails;

        return mons.getDb().then((db: string) => {
          var doc = new DOMParser().parseFromString(db, "text/xml");
          const ps = Array.from(doc.getElementsByTagName('p'));
          const _rows: any[] = [];
          let totalMinutes = 0;

          ps.forEach(p => {
            const content = p?.textContent?.split(',') || [];

            if (pageDetails?.current.title === (content && content[2].trim())) {
              _rows.push({
                startDate: content ? content[0] : '',
                startTime: content ? content[1] : '',
                title: content ? content[2].trim() : '',
                minutesSpentLearning: content ? content[3] : '',
                totalSessionMinutes: content ? content[4] : ''
              });
              totalMinutes += Number(content[3]);
            }
          });

          setTotalMinutes(totalMinutes);
          setRows(_rows);
        });
      }).finally(() => {
        setLoading(false);
      });
    } else {
      props.history.push(routerService.getHomeRoute());
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

  const stopTimer = useCallback(() => {
    const totalMillis = sliderValueRef.current * 60 * 1000;
    const totalMillisSpeantLeaning = (Date.now() - startMillis.current.getTime());
    const minutesSpentLearning = totalMillisSpeantLeaning / (60000);
    const totalSessionMinutes = totalMillis / (60000);
    const startDate = `${startMillis.current.getDate()}-${startMillis.current.getMonth() + 1}-${startMillis.current.getFullYear()}`;
    const startTime = `${startMillis.current.getHours()}:${startMillis.current.getMinutes()}:${startMillis.current.getSeconds()}`;

    const rowDetails = {
      minutesSpentLearning,
      startDate,
      startTime,
      title: pageDetails.current.title,
      totalSessionMinutes
    };

    // Update one note page which tracks learning
    mons.updateOneNotePage(rowDetails).then(() => {
      setRows((rows: any) => [...rows, rowDetails]);
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : <Typography variant="h6" component="h6" color="textSecondary" gutterBottom>Nothing to display</Typography>
  );

  return (
    <>
      <Layout hideNavDrawer={true} routeInfo={routerService.getRouteInfo('timer')}>
        <QuitDialog open={openQuitDialog} onClose={() => { setQuitDialog(false) }} onQuit={() => {
          setQuitDialog(false)
          stopTimer()
        }}></QuitDialog>

        {
          !isTicking ?
            <Typography variant="h5" component="h6" gutterBottom>Study {pageDetails.current && `"${pageDetails.current.title}"`} for {sliderValue} Minutes</Typography> :
            <Typography variant="h5" component="h6" gutterBottom>{pageDetails.current && `"${pageDetails.current.title}"`}: {timeLeft}</Typography>
        }

        {useMemo(() => (
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
                  step={5}
                  max={120}
                  defaultValue={ sliderValueRef.current } /> :
                  <LinearProgress
                    variant="buffer"
                    value={100 - timeLeftPercent}
                    valueBuffer={0}
                    color="secondary"
                  />
              }
            </div>

            {
              !isTicking ?
                (<Button onClick={startTimer} variant="contained" color="primary">Start</Button>) :
                (<Button onClick={() => {
                  setQuitDialog(true)
                }} variant="contained" color="primary">Quit</Button>)
            }
          </>
          // eslint-disable-next-line react-hooks/exhaustive-deps
        ), [isTicking, rows, timeLeftPercent])}

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