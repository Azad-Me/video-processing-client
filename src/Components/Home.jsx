
import { Card, Col, Row } from 'antd';
import imgaeProc from '../assets/imgproc.jpg';
import vidproc from '../assets/vidproc1.jpg';
import { useState } from 'react';
const { Meta } = Card;
export default function Home() {
    const [loading, setLoading] = useState(true);
    return (
        <div >
            <h1 className='mb-5'>Welcome to the Media Processing App</h1>
            <div className=' flex flex-col justify-center'>
            <h2 className='text-lg font-semibold mb-4 '>Select the service</h2>
                <Row gutter={16} className='flex justify-center'>
                    <Col span={10}>
                        <Card
                            hoverable
                            // style={{ width: 240 }}
                            cover={<img className='h-48 object-cover' alt="example" src={imgaeProc} />}
                        >
                            <Meta title="Image Processing" description="Process the images for Object Detection and Pose Estimation" />
                        </Card>
                    </Col>
                    <Col span={10}>
                        <Card
                            hoverable
                            // style={{ width: 240 }}
                            cover={<img className='h-48 object-cover' alt="example" src={vidproc} />}
                        >
                            <Meta title="Video Processing" description="Object Detection and Pose Estimation for every Frame" />
                        </Card>
                    </Col>
                    <Col span={10}>
                        <Card
                            hoverable
                            style={{  marginTop: '16px'  }}
                            cover={<img className='h-48 object-cover' alt="example" src={vidproc} />}
                        >
                            <Meta title="Process Live Streaming" description="Coming Soon" />
                        </Card>
                    </Col>
                </Row>
            </div>
           
        </div>
    );
}
