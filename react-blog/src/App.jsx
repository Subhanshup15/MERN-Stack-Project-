
import './App.css'
import Header from './layout/Header'
import  Login,{Profile,Setting}  from './layout/Footer'
//lOGIN IA DEFULT EXPORT
//PROFILE AND SETTING ARE NAMED EXPORT
//{} USE IN THIS THAT THIS IS MULTI EXPORT

function App() {
  return <>

    <div style={{ backgroundColor: '#1ea87aff', padding: '100px' }}>

      <Header />
      <Login />
      <Profile />
      <Setting />
      <h1 style={{ color: 'blue', fontFamily: "cabria" }}>Sagar</h1>
      <h4 style={{ color: 'green', fontFamily: "cambria" }}>Pardeshi</h4>
    </div>
  </>


}

export default App
