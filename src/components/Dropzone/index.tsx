import React, {useCallback, useState} from 'react'
import {useDropzone, DropzoneOptions} from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'

import './styles.css'

interface Props {
  onFileUploaded: (file: File) => void;
}

const DropzoneArea: React.FC<Props> = ({ onFileUploaded }) => {
  const [ selectedFileUrl, setSelectedFileUrl ] = useState('');
  
  const onDrop = useCallback((acceptedFiles: any[]) => {
    const file = acceptedFiles[0];

    const fileURL = URL.createObjectURL(file);
    setSelectedFileUrl(fileURL);
    onFileUploaded(file);
  }, [onFileUploaded])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
  })

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />

      {
        selectedFileUrl
        ? <img src={selectedFileUrl} alt="Imagem do estabelecimento" />
        : (
          isDragActive
          ?
          <p>
            <FiUpload/>
            Solte o arquivo
          </p>
          :
          <p>
            <FiUpload/>
            Arraste a imagem do estabelecimento aqui
          </p>
        )
      }
    </div>
  )
}

export default DropzoneArea;