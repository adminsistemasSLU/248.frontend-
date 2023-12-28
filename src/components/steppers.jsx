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
import PaidIcon from '@mui/icons-material/Paid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import '../styles/button.scss';
import '../styles/form.scss';
import PersonalForm from './Brockers/personalForm';
import ProtectObjectsTable from './Brockers/protectObjectsTable';
import PaidForm from './Brockers/paidForm';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ProductListCards from './Brockers/productListCards';
import PaymentMethods from './Brockers/paymentMethods';

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
  width: 40,
  height: 40,
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
    3: <LocalFireDepartmentIcon />,
    4: <PaidIcon/>,
    5: <AddShoppingCartIcon/>
  };

  return (
    <ColorlibStepIconRoot  style={{aspectRatio:'1/1'}} ownerState={{ completed, active }} className={className}>
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
    { label: 'Producto', formComponent: <ProductListCards /> },
    { label: 'Riesgo', formComponent: <ProtectObjectsTable /> },
    { label: 'Pago', formComponent: <PaidForm /> },
    { label: 'Pasarela de Pago', formComponent: <PaymentMethods /> },
  ];

  // const steps2 = ['Datos Personales', 'Producto', 'Forma de Pago'];

  const [activeStep, setActiveStep] = React.useState(0);
  const [completed] = React.useState({});

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


  return (
    <Stack className={'stack-content'} spacing={4}>
      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((step, index) => (
          <Step  key={index}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              {step.label}
            </StepLabel>
           
          </Step>
        ))}
      </Stepper>
      <div style={{ display: 'flex', flexDirection: 'row', pt: 2, justifyContent: 'center' , marginBottom: '10%'}}>
        <Box style={{width:'90%'}} >
          {steps[activeStep].formComponent}
          <div style={{ display: 'flex', flexDirection: 'row', pt: 2, justifyContent: 'center', gap: '10%'  }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
              className='btnStepper btnBack'
            >
              Regresar
            </Button>


            
            <Button onClick={handleNext} sx={{ mr: 1 }} className='btnStepper'>
              Siguiente
            </Button>
           
          </div>
        </Box>
      </div>
    </Stack>
  );
}