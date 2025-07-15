import Toast from 'react-native-toast-message';

export const handleSuccess=(msg)=>{
    Toast.show({
        type:'success',
        text1:msg,
        position:'top',
    })
}

export const handleError=(msg)=>{
    Toast.show({
        type:'error',
        text1:msg,
        position:'top',
    })
}