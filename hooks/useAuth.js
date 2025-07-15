import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect,useState,useCallback} from 'react';

export default function useAuth(){
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setAuth] = useState(false);
    
    const checkToken = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setAuth(!!token);
    } catch (err) {
      console.error('Error checking token:', err);
      setAuth(false);
    } finally {
      setLoading(false);
    }
  },[]);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  return { loading, isAuthenticated,refresh:checkToken };
}