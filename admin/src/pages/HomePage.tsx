import { Main, Loader } from '@strapi/design-system';
import { useIntl } from 'react-intl';
 import getConfig from '../api/getconfig';
 import {  } from '@strapi/design-system';

import { getTranslation } from '../utils/getTranslation';
import { useEffect, useState } from 'react';

const HomePage = () => {
  const [data , setData ] = useState({})

  useEffect(() => {
    getConfig().then((response) => {
      setData(response)
    })
  }, []
  )
  const { formatMessage } = useIntl();

  console.log(data)

  return (
    
    <Main>
      <h1>Welcome to {formatMessage({ id: getTranslation('plugin.name') })}</h1>
    </Main>
  );
};

export { HomePage };
