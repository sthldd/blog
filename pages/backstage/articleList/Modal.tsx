import React, { useState } from 'react';
import { Modal, Button,Form } from 'antd';
import { NextComponentType, NextPage } from 'next';

type Props = {
  isModalVisible:boolean;
  title:string;
  onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onOk: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  cancelText:string,
  okText:string
}

const FormModal:NextPage<Props> = (props) =>{
  const {onCancel,onOk} = props
  return(
    <div>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
    </div>
  )
}

export default FormModal;