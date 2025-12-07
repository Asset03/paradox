import { Card, Row, Col } from 'antd';
import { FileTextOutlined, MessageOutlined } from '@ant-design/icons';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="text-center">
      <p className="text-gray-600 mb-8">
        Мини-интерфейс для управления документами и чат-ассистентом
      </p>
      
      <Row gutter={24} justify="center">
        <Col span={12}>
          <Link href="/documents">
            <Card 
              hoverable 
              className="h-full transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col items-center">
                <FileTextOutlined className="text-4xl text-blue-500 mb-4" />
                <h1>Документ страница</h1>
              </div>
            </Card>
          </Link>
        </Col>
        
        <Col span={12}>
          <Link href="/chat">
            <Card 
              hoverable 
              className="h-full transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col items-center">
                <MessageOutlined className="text-4xl text-green-500 mb-4" />
                <h1>Чат страница</h1>
              </div>
            </Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
};