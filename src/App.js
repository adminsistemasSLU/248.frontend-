import './App.css';
import Header from './components/header'; 
import Footer from './components/footer'; 

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // Al menos el 100% del alto de la ventana
  },
  content: {
    flex: 1, // Este elemento se expandirá para ocupar el espacio restante
  },
};

const  App = () => {
  return (
    <div className="App" style={styles.container}>
      <Header /> {}
        <div style={styles.content}>
            
        </div>
      <Footer /> {}
    </div>
  );
}

export default App;
