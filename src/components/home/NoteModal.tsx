import React, {useContext, useRef, useState} from "react";
import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent, IonFab, IonFabButton,
    IonHeader, IonIcon, IonImg, IonInfiniteScroll, IonLabel,
    IonModal,
    IonSegment,
    IonSegmentButton, IonTabBar, IonTabButton,
    IonText,
    IonToolbar
} from "@ionic/react";
import {HomeStateContext} from "./contexts/HomeStateProvider";
import style from "./styles/Modal.module.css"
import {arrowDown, chevronBack, chevronUp} from "ionicons/icons";
import {Swiper, SwiperSlide} from "swiper/react";

type setState = (stat:boolean) => void;


function NoteModal () {
    const modal = useRef<HTMLIonModalElement>(null);
    const {noteState, modalState, setModalState} = useContext(HomeStateContext);
    const [content, setContent] = useState(true);
    return (
        <>
            <IonModal
                mode="md"
                onIonModalDidDismiss={(ev) => {
                        if (setModalState) {
                            setModalState(false)
                        }
                        setContent(true);
                    }

                }
                ref={modal}
                isOpen={modalState}
                initialBreakpoint={0.3}
                breakpoints={[0, 0.3, 1.0]}
                backdropDismiss={false}
                backdropBreakpoint={0.75}

            >
                <IonHeader  color="secondary" >
                    <IonToolbar  color="secondary">
                        <IonSegment className={style.segmentStyle} color="primary" value={noteState?.title}
                        onIonChange={(ev) => {
                            const selectedValue = ev.detail.value;
                            setContent(selectedValue !== "raw");
                        }}>
                            <IonSegmentButton className={style.segmentButtonStyle} value="raw">
                                <IonLabel>Image</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton  className={style.segmentButtonStyle} value={noteState?.title}>
                                <IonLabel>Text</IonLabel>
                            </IonSegmentButton>

                        </IonSegment>

                    </IonToolbar>
                </IonHeader>

                <IonContent className="ion-padding" color="secondary" >
                    {content && <IonText>
                        <h1>{noteState?.title}</h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ipsum nisl, vestibulum non nisi ac, feugiat gravida tortor. Aenean sollicitudin sed tortor nec tempus. Ut volutpat libero sem, ut vulputate mi condimentum volutpat. Maecenas imperdiet ipsum urna, non pretium felis congue condimentum. Etiam dapibus tincidunt luctus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In feugiat elit malesuada urna imperdiet ultrices pulvinar ac ipsum. Mauris tincidunt suscipit leo ut porta. In ullamcorper tristique tellus, eget euismod quam suscipit auctor. Ut viverra in augue eu dapibus. Aliquam placerat sem elit, id euismod risus lacinia a.

                            Aliquam quis erat elementum, varius turpis vitae, finibus mi. Praesent sodales vitae ex id faucibus. Maecenas aliquam, magna ac commodo malesuada, nulla nibh ultricies tortor, ac ultricies risus purus sit amet orci. Proin vitae nisi vitae eros tempus congue. Quisque vel sapien neque. Donec id erat bibendum, elementum felis sed, faucibus metus. Praesent justo mi, viverra vitae congue quis, suscipit a risus. Nulla facilisi.

                            Nulla interdum lacus a neque fermentum, eu mattis felis tempor. Curabitur sed odio consectetur, vulputate velit venenatis, pulvinar mauris. Etiam molestie facilisis magna eu porttitor. Fusce pharetra, ante quis sollicitudin tempus, ex libero porttitor diam, sed eleifend orci neque quis magna. Pellentesque ornare, metus ac sollicitudin blandit, urna neque pretium ipsum, vitae varius quam arcu a libero. Integer leo sapien, consectetur in condimentum volutpat, venenatis vel massa. Nullam ac magna ante. Aenean in tortor quis ligula vulputate tempor. Mauris neque felis, bibendum in feugiat quis, fringilla et tellus. Suspendisse enim quam, vehicula nec euismod eget, feugiat sit amet nibh. Phasellus tincidunt eu quam nec aliquet.

                            Sed pretium ultricies semper. Morbi ultrices pulvinar eros at eleifend. Donec volutpat scelerisque odio in tincidunt. Mauris sollicitudin pretium leo quis laoreet. Suspendisse rhoncus quam ac dolor rutrum gravida. Morbi purus nulla, pharetra ac cursus nec, pretium in risus. Sed lacus purus, facilisis ac lorem vel, pellentesque iaculis eros. Morbi vitae velit eget quam cursus posuere.

                            Maecenas sagittis diam id enim dignissim, et aliquet elit hendrerit. Nunc fringilla facilisis dui in dignissim. Nam in vehicula ligula. Nullam pulvinar libero ut vulputate imperdiet. Vivamus iaculis risus metus, nec consectetur sem congue nec. Nam ac mi id felis blandit iaculis. Nulla sed eros eros. Sed vestibulum egestas feugiat. Nunc non tempus mi. Duis at consequat orci, nec tristique urna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam sed diam quis mi rhoncus ornare. Etiam malesuada purus vitae dignissim hendrerit.</p>
                    </IonText> }
                    {!content &&
                        <Swiper
                            spaceBetween={50}
                            slidesPerView={1}
                            onSwiper={(swiper) => console.log(swiper)}
                            style={{width: '100%', height:'100%'}}
                            pagination={true}
                            direction={"vertical"}

                            // modules={[Pagination]}
                        >
                            {noteState?.imageUrls.map((img, index) => (
                                <SwiperSlide key={index} style={{textAlign: 'center', display:'flex', justifyContent:'center', alignItems: 'center'}}>

                                        <IonImg src={img} style={{display: 'block', width:'100%', height:"100%"}} ></IonImg>


                                </SwiperSlide>
                            ))}
                        </Swiper>
                    }
                </IonContent>

            </IonModal>

        </>

    );

}

export default NoteModal;