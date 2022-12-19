import React from 'react';
import buildImg from '../assets/images/builder.jpg';
import '../css/build.scss';
const InBuildPage = () => {
  console.log('process.env.REACT_APP_API_URL', process.env.REACT_APP_API_URL)
  return (
    <div className='text-center build'>
        <img height={500} src={buildImg} alt="builder image" />
        <h1>אתר בבניה נשמח שתחזרו בקרוב...</h1>
    </div>
  )
}

export default InBuildPage