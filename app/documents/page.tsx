/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Spin, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { DocumentTableItem } from '../types/document';
import DocumentModal from './DocumentModal';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<DocumentTableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<DocumentTableItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      const data = response.data.slice(0, 10);

      const formattedData: DocumentTableItem[] = data.map((doc: any, index: number) => ({
        ...doc,
        version: `v${(index % 3) + 1}.${(index % 5)}`,
        size: `${Math.floor(Math.random() * 1000) + 100} KB`,
        uploadDate: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString('ru-RU'),
      }));
      
      setDocuments(formattedData);
    } catch (error) {
      message.error('Ошибка при загрузке документов');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (document: DocumentTableItem) => {
    setSelectedDocument(document);
    setModalVisible(true);
  };

  const columns = [
    {
      title: 'Название файла',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Версия',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: 'Размер',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Дата загрузки',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: DocumentTableItem) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          Подробнее
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl text-black font-bold mb-6">Документы</h2>
        <Table
          dataSource={documents}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </div>

      <DocumentModal
        document={selectedDocument}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

export default DocumentsPage;