import React from 'react';
import ProductList from './components/ProductList';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <main>
        <ProductList />
      </main>
    </div>
  );
};

export default App;
