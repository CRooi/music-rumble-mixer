import React, { useState, useEffect, useRef } from 'react'
import { EuiButton, EuiCard, EuiCheckbox, EuiIcon, EuiModal, EuiModalBody, EuiModalHeader, EuiModalHeaderTitle, EuiTitle, EuiProgress, EuiSpacer, EuiFlexGroup, EuiFlexItem, EuiLink } from '@elastic/eui'
import { tracks, translations } from './resourcesMap'

interface AudioTrack {
    buffer: AudioBuffer
    source: AudioBufferSourceNode | null
    startTime: number
}

export default function App() {
    const others = ['death', 'piano', 'starting']
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [modalTrait, setModalTrait] = useState('')
    const [selectedTraits, setSelectedTraits] = useState<string[]>([])
    const [selectedTracks, setSelectedTracks] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadingProgress, setLoadingProgress] = useState(0)
    const [playbackState, setPlaybackState] = useState<'stopped' | 'playing' | 'looping'>('stopped')

    const audioContextRef = useRef<AudioContext | null>(null)
    const audioTracksRef = useRef<Record<string, AudioTrack>>({})
    const startTimeRef = useRef<number | null>(null)
    const loopTimeoutRef = useRef<number | null>(null)

    const TraitCard = ({ trait }: { trait: string }) => {
        const isSelected = selectedTraits.includes(trait)
        return (
            <div className='relative'>
                {isSelected && (
                    <div className='flex items-center justify-center z-10 absolute w-full h-full overflow-hidden'>
                        <img src={`/icon/${trait}.png`} alt={trait} className='h-full blur-2xl' />
                    </div>
                )}
                
                <EuiCard
                    icon={<EuiIcon type={`/icon/${trait}.png`} size='xl' title={`${trait}_icon`} />}
                    title={translations[trait]}
                    onClick={() => setModal(trait)}
                    className={`z-50 ${isSelected ? '!bg-opacity-0 !bg-white' : ''} relative`}
                />
            </div>
        )
    }

    useEffect(() => {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()

        const totalTracks = Object.values(tracks).flat().length
        let loadedTracks = 0

        Object.keys(tracks).forEach((trait) => {
            tracks[trait].forEach((track) => {
                fetch(`/tracks/${track}.aac`)
                    .then(response => response.arrayBuffer())
                    .then(arrayBuffer => audioContextRef.current!.decodeAudioData(arrayBuffer))
                    .then(audioBuffer => {
                        audioTracksRef.current[track] = {
                            buffer: audioBuffer,
                            source: null,
                            startTime: 0
                        }
                        loadedTracks++
                        setLoadingProgress((loadedTracks / totalTracks) * 100)
                        if (loadedTracks === totalTracks) {
                            setIsLoading(false)
                        }
                    })
            })
        })

        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close()
            }
            if (loopTimeoutRef.current) {
                window.clearTimeout(loopTimeoutRef.current)
            }
        }
    }, [])

    useEffect(() => {
        if (playbackState !== 'stopped') {
            playNewTracks()
        }
    }, [selectedTracks])

    const playTracks = (loop: boolean) => {
        if (audioContextRef.current && selectedTracks.length > 0) {
            if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume()
            }

            stopTracks()

            startTimeRef.current = audioContextRef.current.currentTime
            playNewTracks()

            setPlaybackState(loop ? 'looping' : 'playing')

            if (loop) {
                scheduleNextLoop()
            } else {
                scheduleSinglePlaybackEnd()
            }
        }
    }

    const playNewTracks = () => {
        if (audioContextRef.current && startTimeRef.current !== null) {
            const currentTime = audioContextRef.current.currentTime
            const elapsedTime = currentTime - startTimeRef.current

            selectedTracks.forEach((track) => {
                if (!audioTracksRef.current[track].source) {
                    const source = audioContextRef.current!.createBufferSource()
                    source.buffer = audioTracksRef.current[track].buffer
                    source.connect(audioContextRef.current!.destination)
                    source.loop = false
                    source.start(0, elapsedTime % source.buffer.duration)
                    audioTracksRef.current[track].source = source
                    audioTracksRef.current[track].startTime = currentTime - elapsedTime
                }
            })
        }
    }

    const scheduleNextLoop = () => {
        if (audioContextRef.current && startTimeRef.current !== null) {
            const currentTime = audioContextRef.current.currentTime
            const elapsedTime = currentTime - startTimeRef.current

            const longestDuration = Math.max(...selectedTracks.map(track =>
                audioTracksRef.current[track].buffer.duration
            ))

            const timeUntilNextLoop = longestDuration - (elapsedTime % longestDuration)

            if (loopTimeoutRef.current) {
                window.clearTimeout(loopTimeoutRef.current)
            }

            loopTimeoutRef.current = window.setTimeout(() => {
                // 停止当前播放的tracks
                Object.values(audioTracksRef.current).forEach((track) => {
                    if (track.source) {
                        track.source.stop()
                        track.source = null
                    }
                })
                
                // 重置开始时间并重新开始播放
                startTimeRef.current = audioContextRef.current!.currentTime
                playNewTracks()
                
                // 确保播放状态保持为'looping'
                setPlaybackState('looping')
                
                // 安排下一次循环
                scheduleNextLoop()
            }, timeUntilNextLoop * 1000)
        }
    }

    const scheduleSinglePlaybackEnd = () => {
        if (audioContextRef.current && startTimeRef.current !== null) {
            const longestDuration = Math.max(...selectedTracks.map(track =>
                audioTracksRef.current[track].buffer.duration
            ))

            if (loopTimeoutRef.current) {
                window.clearTimeout(loopTimeoutRef.current)
            }

            loopTimeoutRef.current = window.setTimeout(() => {
                stopTracks()
            }, longestDuration * 1000)
        }
    }

    const stopTracks = () => {
        Object.values(audioTracksRef.current).forEach((track) => {
            if (track.source) {
                track.source.stop()
                track.source = null
            }
        })
        startTimeRef.current = null
        setPlaybackState('stopped')
        if (loopTimeoutRef.current) {
            window.clearTimeout(loopTimeoutRef.current)
        }
    }

    const clearSelection = () => {
        stopTracks()
        setSelectedTracks([])
        setSelectedTraits([])
    }

    const handleCheckboxChange = (trait: string, track: string) => {
        let updatedTracks = []
        if (selectedTracks.includes(track)) {
            updatedTracks = selectedTracks.filter(t => t !== track)
            if (audioTracksRef.current[track].source) {
                audioTracksRef.current[track].source.stop()
                audioTracksRef.current[track].source = null
            }
        } else {
            updatedTracks = [...selectedTracks, track]
        }
        setSelectedTracks(updatedTracks)
        const updatedTraits = updatedTracks.map(t => t.split('_')[0])
        setSelectedTraits(Array.from(new Set(updatedTraits)))
    }

    const closeModal = () => setIsModalVisible(false)
    const setModal = (trait: string) => {
        setModalTrait(trait)
        setIsModalVisible(true)
    }

    const ModalBody = ({ trait }: { trait: string }) => {
        return (
            <>
                {tracks[trait].map((track) => {
                    return (
                        <EuiCheckbox
                            id={track}
                            label={
                                track.replace(trait, '').split('_').map(word => {
                                    return translations[word]
                                })
                            }
                            onChange={() => handleCheckboxChange(trait, track)}
                            checked={selectedTracks.includes(track)}
                            key={track}
                        />
                    )
                })}
            </>
        )
    }

    if (isLoading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='w-[95%] lg:w-[60%] xl:w-[50%]'>
                    <EuiTitle size='m'><div>载入中...</div></EuiTitle>
                    <EuiTitle size='s' className='opacity-50 !text-base'><div>低性能设备或无法正常载入与使用，如遇问题请更换设备重试。</div></EuiTitle>
                    <EuiSpacer size='m' />
                    <EuiProgress value={loadingProgress} max={100} size='m' />
                </div>
            </div>
        )
    }

    return (
        <div className='p-3'>
            <EuiTitle size='l'><div>云顶之弈：强音争霸 音乐混音器</div></EuiTitle>
            <EuiSpacer size='m' />
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
                <EuiButton 
                    onClick={() => playTracks(false)} 
                    disabled={playbackState !== 'stopped' || selectedTracks.length === 0}
                >
                    开始播放（单次）
                </EuiButton>
                <EuiButton 
                    onClick={() => playTracks(true)} 
                    disabled={playbackState !== 'stopped' || selectedTracks.length === 0}
                >
                    开始播放（循环）
                </EuiButton>
                <EuiButton 
                    onClick={stopTracks} 
                    disabled={playbackState === 'stopped'}
                >
                    停止播放
                </EuiButton>
                <EuiButton 
                    onClick={clearSelection} 
                    disabled={selectedTracks.length === 0}
                >
                    清除所有选择
                </EuiButton>
            </div>
            <EuiSpacer size='m' />
            <EuiTitle size='m'><div>羁绊</div></EuiTitle>
            <EuiSpacer size='m' />
            {isModalVisible && <EuiModal onClose={closeModal}>
                <EuiModalHeader>
                    <EuiModalHeaderTitle className='flex items-center gap-1'>
                        {!others.includes(modalTrait) && <EuiIcon type={`/icon/${modalTrait}.png`} size='xl' title={`${modalTrait}_icon`} />}
                        {translations[modalTrait]}
                    </EuiModalHeaderTitle>
                </EuiModalHeader>
                <EuiModalBody>
                    <ModalBody trait={modalTrait} />
                </EuiModalBody>
            </EuiModal>}

            <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mt-3'>
                {Object.keys(tracks).map((trait) => {
                    if (others.includes(trait)) {
                        return null
                    }
                    return <TraitCard trait={trait} key={trait} />
                })}
            </div>

            <EuiSpacer size='m' />
            <EuiTitle size='m'><div>其他</div></EuiTitle>
            <EuiSpacer size='m' />

            <div className='grid grid-cols-2 lg:grid-cols-3 gap-3'>
                {others.map((trait) => {
                    return (
                        <EuiCard
                            title={translations[trait]}
                            onClick={() => setModal(trait)}
                            key={trait}
                        />
                    )
                })}
            </div>

            <EuiSpacer size='m' />

            <div className='text-right opacity-50'>
                The copyright of any images and music used on this website is owned by Riot Games, Inc.
            </div>

            <div className='text-right opacity-50'>
                Developed by <EuiLink href='https://crooi.io/' target='_blank'>CRooi</EuiLink>.
            </div>
        </div>
    )
}