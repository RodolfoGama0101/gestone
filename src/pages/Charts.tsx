import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonText, IonToolbar } from '@ionic/react';
import './Charts.css';
import Verifica from '../firebase/verifica';
import ChartBar from '../components/ChartBar';

const Charts: React.FC = () => {
  Verifica();

  return (
    <IonPage>
      {/* Header */}
      <IonHeader>
        <IonToolbar color={"dark"}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/Home"></IonBackButton>
          </IonButtons>
          <IonText>
            <h1 className='ion-margin'>Charts</h1>
          </IonText>
        </IonToolbar>
      </IonHeader>

      <IonContent color={"dark"}>
        <ChartBar></ChartBar>
      </IonContent>
    </IonPage>
  );
};

export default Charts;