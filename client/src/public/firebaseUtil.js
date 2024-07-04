import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "./firebase";
// Create a root reference
const storage = getStorage(app);

// 'file' comes from the Blob or File API
export const uploadToFirebase = async (type, file) => {
    const storageRef = ref(storage, `${file.name}`);
    await uploadBytes(storageRef, file).then((snapshot) => {
        console.log('Uploaded a blob or file!', snapshot);
    });
}
export const getURLFromFirebase = async (filename) => {
    const url = await getDownloadURL(ref(storage, filename))
    // `url` is the download URL for 'images/stars.jpg'
    return url;
}