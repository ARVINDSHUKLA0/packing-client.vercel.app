// "use client";

// import { useRef, useState } from "react";
// import CanvasSidebar from "@/component/CanvasSidebar";
// import Editor from "@/component/Editor";
// import Preview from "@/component/Preview";

// const Page = () => {
//   const editorRef = useRef(null);
//   const [selectedPanel, setSelectedPanel] = useState(null);

//   const handlePanelSelect = (index, bbox) => {
//     setSelectedPanel({ index, bbox });
//   };

//   const handleAddText = (textContent) => {
//     if (editorRef.current?.addTextToCanvas) {
//       const pos = selectedPanel
//         ? { left: selectedPanel.bbox.x + selectedPanel.bbox.width / 2, top: selectedPanel.bbox.y + selectedPanel.bbox.height / 2 }
//         : { left: 200, top: 200 };
//       editorRef.current.addTextToCanvas(textContent, pos);
//     }
//   };

//   const handleImageUpload = (imageUrl) => {
//     if (editorRef.current?.addImageToCanvas) {
//       const pos = selectedPanel
//         ? {
//             left: selectedPanel.bbox.x + 10,
//             top: selectedPanel.bbox.y + 10,
//             scaleX: (selectedPanel.bbox.width - 20) / 200,
//             scaleY: (selectedPanel.bbox.height - 20) / 200,
//           }
//         : { left: 200, top: 200, scaleX: 0.5, scaleY: 0.5 };
//       editorRef.current.addImageToCanvas(imageUrl, pos);
//     }
//   };

//   return (
//     <div className="row m-0">
//       <div className="col-lg-2 col-md-2 col-sm-2 col-12 p-0">
//         <CanvasSidebar onImageUpload={handleImageUpload} onAddText={handleAddText} />
//       </div>
//       <div className="col-lg-7 col-md-7 col-sm-7 col-12 p-0">
//         <Editor ref={editorRef} onPanelSelect={handlePanelSelect} />
//       </div>
//       <div className="col-lg-3 col-md-3 col-sm-3 col-12">
//         <Preview />
//       </div>
//     </div>
//   );
// };

// export default Page;








"use client";

import { useRef, useState } from "react";
import CanvasSidebar from "@/component/CanvasSidebar";
import Editor from "@/component/Editor";
import Preview from "@/component/Preview";

const Page = () => {
  const editorRef = useRef(null);
  const [selectedPanel, setSelectedPanel] = useState(null);

  const handlePanelSelect = (index, bbox) => {
    setSelectedPanel({ index, bbox });
  };

  const handleAddText = (textContent) => {
    if (!editorRef.current?.addText) return;

    const pos = selectedPanel
      ? {
          left: selectedPanel.bbox.x + 20,
          top: selectedPanel.bbox.y + selectedPanel.bbox.height / 2 - 15,
          width: selectedPanel.bbox.width - 40,
        }
      : { left: 200, top: 200 };

    editorRef.current.addText(textContent, pos);
  };

  const handleImageUpload = (imageUrl) => {
    if (!editorRef.current?.addImage) return;

    const pos = selectedPanel
      ? {
          left: selectedPanel.bbox.x + 15,
          top: selectedPanel.bbox.y + 15,
          scaleX: (selectedPanel.bbox.width - 30) / 300,
          scaleY: (selectedPanel.bbox.height - 30) / 300,
        }
      : { left: 200, top: 200, scaleX: 0.5, scaleY: 0.5 };

    editorRef.current.addImage(imageUrl, pos);
  };

  return (
    <div className="row m-0">
      <div className="col-lg-2 col-md-2 col-sm-2 col-12 p-0">
        <CanvasSidebar onImageUpload={handleImageUpload} onAddText={handleAddText} />
      </div>
      <div className="col-lg-7 col-md-7 col-sm-7 col-12 p-0">
        <Editor ref={editorRef} onPanelSelect={handlePanelSelect} />
      </div>
      <div className="col-lg-3 col-md-3 col-sm-3 col-12">
        <Preview />
      </div>
    </div>
  );
};

export default Page;