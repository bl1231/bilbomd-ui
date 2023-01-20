import { makeStyles } from '@mui/styles';
export default makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    color: 'black',
    display: 'flex',
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(256,256,256,0.95)'
  },
  logo: {
    display: 'flex',
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100px'
  }
}));
