import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Access Denied</h1>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default Unauthorized;