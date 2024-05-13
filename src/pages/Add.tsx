import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import HeaderComponent from '../components/Header';
import './Add.css';

const Add: React.FC = () => {
  return (
    <IonPage>

      <HeaderComponent></HeaderComponent>

      <IonContent fullscreen>
        <h1 className='ion-text-center'>Add</h1>
      </IonContent>
    </IonPage>
  );
};

export default Add;
