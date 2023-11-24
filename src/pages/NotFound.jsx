import React from 'react';

const NotFound = () => {
  return (
    <div >
      <div style={{ display: 'flex', alignItems:'center', justifyContent: 'center', color:'#00a99e',flexDirection:'column',}}> 
        
        <img src={process.env.PUBLIC_URL + '/assets/images/NotFound.jpg'} style={{width:'50%', height:'50%'}}  alt="" />
        <h3>PAGE NOT FOUND</h3>
      </div>
    </div>
  );
};

export default NotFound;
