import { IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonText, IonToolbar } from '@ionic/react';
import './Charts.css';
import FooterTabBar from '../components/FooterTabBar';
import Verifica from '../firebase/verifica';
import Chart from 'react-google-charts';


const Charts: React.FC = () => {
  Verifica();

  const options = {
    title: "Teste supremo",
    is3D: true,
  };

  const data = [
    ["Task", "Hours per Day"],
    ["Work", 10],
    ["Eat", 2],
    ["Commute", 2],
    ["Watch TV", 2],
    ["Sleep", 7],
  ];

  return (
    <IonPage>
      {/* Header */}
      <IonHeader>
        <IonToolbar color={"dark"}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/Home"></IonBackButton>
          </IonButtons>
          <IonText>
            <h1 className='ion-margin'>Grafics</h1>
          </IonText>
        </IonToolbar>
      </IonHeader>

      <IonContent color={"dark"}>
        <Chart
          chartType="PieChart"
          data={data}
          options={options}
          width={"100%"}
          height={"400px"}
          className='chart'
        />
      </IonContent>

      <FooterTabBar></FooterTabBar>
    </IonPage>
  );
};

export default Charts;
