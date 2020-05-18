import React from 'react'
import { shallow } from 'enzyme'

import Loader from '../../components/Loader/index'

test('Should render Loader correctly', () => {
  const wrapper = shallow(<Loader />)
  expect(wrapper).toMatchSnapshot()
})