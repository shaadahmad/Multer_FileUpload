import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Register from './Components/Register';
import UploadPage from './Components/streamPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>

            {
              // token ? <>
              //   <Route path='/admin' element={<AdminPage />}></Route>
              //   <Route path='/add' element={<NewQuestions />}></Route>
              //   {/* <Route path='*' element={<UserContainer />}></Route> */}
              //   <Route path='*' element={<QuizPage />}></Route>
              // </> :
               <>
                <Route path='/' element={<Register />}></Route>
                <Route path='/login' element={<Login />}></Route>
                <Route path='*' element={<Login />}></Route>
                <Route path='/main' element={<UploadPage />}></Route>
              </>
            }

          </Routes>
        </BrowserRouter>
      
    </div>
  );
}

export default App;
