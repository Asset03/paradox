'use client';

import { Modal, Button, Descriptions, message } from 'antd';
import { DocumentTableItem } from '../types/document';
import { useState } from 'react';

interface DocumentModalProps {
  document: DocumentTableItem | null;
  visible: boolean;
  onClose: () => void;
}

const DocumentModal = ({ document, visible, onClose }: DocumentModalProps) => {
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!document) return;
    
    setAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Анализ выполнен успешно!');
    } catch (error) {
      message.error('Ошибка при анализе документа');
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  if (!document) return null;

  return (
    <Modal
      title={`Документ: ${document.title}`}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Закрыть
        </Button>,
        <Button
          key="analyze"
          type="primary"
          loading={analyzing}
          onClick={handleAnalyze}
        >
          Проанализировать
        </Button>,
      ]}
      width={700}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="ID">{document.id}</Descriptions.Item>
        <Descriptions.Item label="Название файла">{document.title}</Descriptions.Item>
        <Descriptions.Item label="Версия">{document.version}</Descriptions.Item>
        <Descriptions.Item label="Размер">{document.size}</Descriptions.Item>
        <Descriptions.Item label="Дата загрузки">{document.uploadDate}</Descriptions.Item>
        <Descriptions.Item label="ID пользователя">{document.userId}</Descriptions.Item>
        <Descriptions.Item label="Содержимое">
          <div className="max-h-40 overflow-y-auto">
            {document.body}
          </div>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default DocumentModal;