import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import qs from 'querystring';
import {Button, Input, message, Modal, Row, Col} from 'antd'
import dayjs from 'dayjs';
import React, {useState} from 'react';
const colProps = {
  lg: 16,
  xl: 16,
  xxl: 16,
  style: {
      marginBottom: 16
  }
}

const TwoColProps = {
  lg: 8,
  xl: 8,
  xxl: 8,
  style: {
      marginBottom: 16,
      float: 'right'
  }
}
const Filter: NextPage = () => {
  return(
    <Row gutter={24}>
      <Col {...colProps}>
          
      </Col>

      <Col {...TwoColProps} style={{ marginBottom: 20 }}>
          
      </Col>
  </Row>
  )
}

export default Filter;