import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import PersonIcon from '@mui/icons-material/Person';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import PaidIcon from '@mui/icons-material/Paid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import '../styles/button.scss';
import PersonalForm from './Brockers/personalForm';
import ProtectObjectsTable from './Brockers/protectObjectsTable';
import DetailObjectsTable from './Brockers/detailObjectsTable';
import PaidForm from './Brockers/paidForm';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 136deg, #3cf1d9 0%, #00a99e 50%, rgb(74 101 172) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 136deg, #3cf1d9 0%, #00a99e 50%, rgb(74 101 172) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage:
      'linear-gradient( 136deg, #3cf1d9 0%, #00a99e 50%, rgb(74 101 172) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      'linear-gradient( 136deg, #3cf1d9 0%, #00a99e 50%, rgb(74 101 172) 100%)',
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <PersonIcon />,
    2: <ProductionQuantityLimitsIcon />,
    3: <InventoryRoundedIcon />,
    4: <PaidIcon/>
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};





export default function Steppers() {
  const steps = [
    { label: 'Datos Personales', formComponent: <PersonalForm /> },
    { label: 'Producto', formComponent: <ProtectObjectsTable /> },
    { label: 'Detalle de Producto', formComponent: <DetailObjectsTable /> },
    { label: 'Forma de Pago', formComponent: <PaidForm /> },
  ];

  // const steps2 = ['Datos Personales', 'Producto', 'Forma de Pago'];

  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
        // find the first step that has been completed
        steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // const handleStep = (step) => () => {
  //   setActiveStep(step);
  // };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  // const handleReset = () => {
  //   setActiveStep(0);
  //   setCompleted({});
  // };

  return (
    <Stack sx={{ width: '100%', marginTop: '25px' }} spacing={4}>

      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              {step.label}
            </StepLabel>
            {/* Resto del código */}
          </Step>
        ))}
      </Stepper>
      <div style={{ display: 'flex', flexDirection: 'row', pt: 2, justifyContent: 'center' , marginBottom: '10%'}}>
        <Box sx={{ display: 'flex', flexDirection: 'column', pt: 2, width: '80%' }}>
          {steps[activeStep].formComponent}
          <div style={{ display: 'flex', flexDirection: 'row', pt: 2, justifyContent: 'center' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
              className='btnStepper'
            >
              Back
            </Button>


            <Box sx={{ flex: '1 1 auto' }} ><Typography sx={{ mt: 2, mb: 1, py: 1 }}>
              Step {activeStep + 1}
            </Typography></Box>
            <Button onClick={handleNext} sx={{ mr: 1 }} className='btnStepper'>
              Next
            </Button>
            {activeStep !== steps.length &&
              (completed[activeStep] ? (
                <p style={{ color: '#00a99e' }}>
                  Step {activeStep + 1} already completed
                </p>
              ) : (
                <Button onClick={handleComplete} className='btnStepper'>
                  {completedSteps() === totalSteps() - 1
                    ? 'Finish'
                    : 'Complete Step'}
                </Button>
              ))}
          </div>
        </Box>
      </div>
    </Stack>
  );
}