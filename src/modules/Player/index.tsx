import { VisualizerCanvas } from '@/modules/Player/components/VisualizerCanvas';
import Control from '@/modules/Player/components/Control';
import ModeList from '@/modules/Player/components/ModeList';
import styles from './styles.module.scss';

const Player = () => {
  return (
    <>
      <div className={styles.modeDecor}>
        <VisualizerCanvas />
      </div>

      <div className={styles.panel}>
        <Control />
        <ModeList />
      </div>
    </>
  );
};

export default Player;
