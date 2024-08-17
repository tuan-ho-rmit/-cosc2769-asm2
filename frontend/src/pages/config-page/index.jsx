import React from 'react';
import Button from '../../components/button';
import TextField from '../../components/text-field';
import PopUp from '../../components/popup';
import { pushError, pushSuccess } from '../../components/Toast'
import { usePopUp } from '../../components/popup/usePopUp';
import CircularProgress from '../../components/CircularProgress';
import Tooltip from '../../components/tooltip';
import IcLock from './IcLock';
import DropdownMenu from '../../components/dropdown-menu';

export default function ConfigPage() {
  const popUpConfig = usePopUp();
  const popUpLockAccount = usePopUp();
  const menuItems = [
    { label: 'Account settings', onClick: () => console.log('Account settings') },
    { label: 'Support', onClick: () => console.log('Support') },
    { label: 'License', onClick: () => console.log('License') },
    { label: 'Sign out', onClick: () => console.log('Sign out') },
  ];

  return (
    <div className="mt-10 ml-10 mr-10 mb-10">

      <h4 className="text-lg font-bold mb-4">Button Variants</h4>
      <div className="space-y-2">
        <div className="flex space-x-3">
          <Button variant="primary">Primary</Button>
          <Button variant="success">Confirm</Button>
          <Button variant="danger">Cancel</Button>
          <Button variant="outline-primary">Outlined Primary</Button>
          <Button variant="outline-danger">Outlined Danger</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </div>

      <h4 className="text-lg font-bold mt-8 mb-4">Button Sizes</h4>
      <div className="flex space-x-4 items-center">
        <div className="flex flex-col items-center">
          <Button size="sm" variant="primary">Small</Button>
          <span className="text-sm mt-2">Small</span>
        </div>
        <div className="flex flex-col items-center">
          <Button size="md" variant="primary">Medium</Button>
          <span className="text-sm mt-2">Medium</span>
        </div>
        <div className="flex flex-col items-center">
          <Button size="lg" variant="primary">Large</Button>
          <span className="text-sm mt-2">Large</span>
        </div>
      </div>

      <h4 className="text-lg font-bold mt-8 mb-4">Text Field</h4>
      <TextField style={{ maxWidth: '200px' }} />
      <TextField disabled placeholder="Disabled TextField" style={{ maxWidth: '200px' }} />
      <TextField
        placeholder="Error TextField"
        error="This field is required"
        style={{ maxWidth: '200px' }}
      />

      <h4 className="text-lg font-bold mt-8 mb-4">Dropdown menu</h4>
      <DropdownMenu
        title="Options"
        items={menuItems}
        position="bottom-left"
      />

      <h4 className="text-lg font-bold mt-8 mb-4">PopUp</h4>
      <Button variant="outline-primary" onClick={() => popUpConfig.setTrue()} style={{ maxWidth: "200px" }}>
        Show popup
      </Button>
      <PopUp
        {...popUpConfig}
        title="Register"
        onConfirm={() => {
          popUpConfig.onClose();
        }}
        desc={
          <div className="space-y-4 p-4">
            <div className="flex flex-col space-y-2">
              <TextField
                label="Email address"
                type="email"
                placeholder="name@example.com"
                style={{ maxWidth: '100%' }}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <TextField
                label="Username"
                type="text"
                placeholder="username"
                style={{ maxWidth: '100%' }}
              />
            </div>
          </div>
        }
      />

      <h4 className="text-lg font-bold mt-8 mb-4">CircularProgress</h4>
      <div className="space-y-4" style={{ maxWidth: "300px" }}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <CircularProgress size="sm" />
            <span className="text-sm mt-2">Small</span>
          </div>
          <div className="flex flex-col items-center">
            <CircularProgress size="md" />
            <span className="text-sm mt-2">Medium</span>
          </div>
          <div className="flex flex-col items-center">
            <CircularProgress size="lg" />
            <span className="text-sm mt-2">Large</span>
          </div>
        </div>
      </div>

      <h4 className="text-lg font-bold mt-8 mb-4">Toastify</h4>
      <div className="flex items-center justify-between" style={{ maxWidth: "500px" }}>
        <Button variant="outline-primary" onClick={() => pushSuccess('Show Toast Success !')}>
          Push success
        </Button>
        <Button variant="outline-danger" onClick={() => pushError('Show Toast Error !')}>
          Push error
        </Button>
      </div>

      <h4 className="text-lg font-bold mt-8 mb-4">Tooltip</h4>
      <Tooltip text="Lock account" position="top">
        <Button variant="outline-primary" size='sm' onClick={() => popUpLockAccount.setTrue()}>
          <IcLock />
        </Button>
      </Tooltip>

      <PopUp
        {...popUpLockAccount}
        title="Confirmation"
        onConfirm={() => {
          pushSuccess("Lock account successfully")
          popUpLockAccount.onClose();
        }}
        desc={
          <div className="p-4">
            <p className="text-sm text-gray-700">
              Are you sure you want to lock this account? This action cannot be undone.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Please confirm by clicking "Confirm" or cancel if you do not want to proceed.
            </p>
          </div>
        }
      />
    </div>
  );
}
