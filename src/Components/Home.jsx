
import { Card, Col, Row, Modal } from 'antd';
import imgaeProc from '../assets/imgproc.jpg';
import vidproc from '../assets/vidproc1.jpg';
import { useState } from 'react';
import ImageProcess from './ImageProcess';
import VideoProcessor from './VideoProcess';
import RealTimeViewer from './RealTime';
const { Meta } = Card;
export default function Home() {
    const [loading, setLoading] = useState(true);
    const [imageProcessing, setImageProcessing] = useState(false);
    const [videoProcessing, setVideoProcessing] = useState(false);
    const [realTimeProcessing, setRealTimeProcessing] = useState(false);
    const handleImageProcessing = () => {
        // Handle image processing logic here
        setImageProcessing(true)
    };
    const handleVideoProcessing = () => {
        // Handle video processing logic here
        setVideoProcessing(true)
    };
    const handleRealTimeProcessing = () => {
        // Handle real-time processing logic here
        setRealTimeProcessing(true)
    };
    return (
        <div>
            <div >
                <h1 className='mb-5'>Welcome to the Media Processing App</h1>
                <div className=' flex flex-col justify-center'>
                    <h2 className='text-lg font-semibold mb-4 '>Select the service</h2>
                    <Row gutter={16} className='flex justify-center'>
                        <Col span={10}>
                            <Card
                                hoverable
                                onClick={handleImageProcessing}
                                // style={{ width: 240 }}
                                cover={<img className='h-48 object-cover' alt="example" src={imgaeProc} />}
                            >
                                <Meta title="Image Processing" description="Process the images for Object Detection and Pose Estimation" />
                            </Card>
                        </Col>
                        <Col span={10}>
                            <Card
                                hoverable
                                onClick={handleVideoProcessing}

                                // style={{ width: 240 }}
                                cover={<img className='h-48 object-cover' alt="example" src={vidproc} />}
                            >
                                <Meta title="Video Processing" description="Object Detection and Pose Estimation for every Frame" />
                            </Card>
                        </Col>
                        <Col span={10}>
                            <Card
                                hoverable
                                onClick={handleRealTimeProcessing}
                                style={{ marginTop: '16px' }}
                                cover={<img className='h-48 object-cover' alt="example" src={vidproc} />}
                            >
                                <Meta title="Process Live Streaming" description="Coming Soon" />
                            </Card>
                        </Col>
                    </Row>

                </div>

            </div>
            <div className='flex h-52'>

                {
                    imageProcessing && (
                        <Modal
                            title="Image Processing"
                            width="90%"
                            style={{ top: 40 }}
                            bodyStyle={{ height: "80vh", overflowY: "auto" }}
                            open={imageProcessing}
                            onCancel={() => setImageProcessing(false)}
                            footer={null}
                        >
                            <ImageProcess />
                        </Modal>
                    )
                }
                {
                    videoProcessing && (
                        <Modal
                            title="Video Processing"
                            width="90%"
                            style={{ top: 40 }}
                            bodyStyle={{ height: "80vh", overflowY: "auto" }}
                            open={videoProcessing}
                            onCancel={() => setVideoProcessing(false)}
                            footer={null}
                        >
                            <VideoProcessor />
                        </Modal>
                    )
                }
                {
                    realTimeProcessing && (
                        <Modal
                            title="Real-Time Stream Processing"
                            width="90%"
                            style={{ top: 40 }}
                            bodyStyle={{ height: "80vh", overflowY: "auto" }}
                            open={realTimeProcessing}
                            onCancel={() => setRealTimeProcessing(false)}
                            footer={null}
                        >
                            <RealTimeViewer />
                        </Modal>
                    )
                }
            </div>

        </div>
    );
}
