import React, { useState, useEffect } from 'react';
import Login from '../components/Login';
import Signup from '../components/Signup';
import { useHistory } from 'react-router-dom';

const HomePage = () => {
  const history = useHistory()

  useEffect(()=>{
      const userInfo = JSON.parse(localStorage.getItem("userInfo"))

      if(!userInfo){
          history.push("/")
      }
  },[history])


  const [activeTab, setActiveTab] = useState('tab-1');

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className='w-full h-screen flex justify-center items-center gap-6'>
      <div className="tabs tabs-underline">
        <input
          type="radio"
          id="tab-1"
          name="tab-3"
          className="tab-toggle"
          defaultChecked
          onChange={() => handleTabClick('tab-1')}
        />
        <label htmlFor="tab-1" className="tab px-6 font-bold">
          Login
        </label>

        <input
          type="radio"
          id="tab-2"
          name="tab-3"
          className="tab-toggle"
          onChange={() => handleTabClick('tab-2')}
        />
        <label htmlFor="tab-2" className="tab px-6 font-bold">
          Sign Up
        </label>
      </div>

      <div className="tab-content">
        {activeTab === 'tab-1' && (
            
          <div>
            {/* Content for Tab 1 */}
            <Login/>
          </div>
        )}

        {activeTab === 'tab-2' && (
          <div>
            {/* Content for Tab 2 */}
            <Signup/>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;