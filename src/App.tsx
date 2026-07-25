import Header from './layouts/Header';
import EmployeesPage from './pages/EmployeesPage';

function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header />
      <main>
        <EmployeesPage />
      </main>
    </div>
  );
}

export default App;
