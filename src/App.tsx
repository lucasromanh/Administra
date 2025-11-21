import { Router } from './router';
import { Toaster } from 'sonner';
import './App.css';

function App() {
  return (
    <>
      <Router />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
