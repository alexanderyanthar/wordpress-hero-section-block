import { useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	RichText,
	MediaPlaceholder,
	BlockControls,
	MediaReplaceFlow,
	InspectorControls,
	store as blockEditorStore,
} from "@wordpress/block-editor";
import "./editor.scss";
import { isBlobURL, revokeBlobURL } from "@wordpress/blob";
import {
	Spinner,
	withNotices,
	ToolbarButton,
	PanelBody,
	TextareaControl,
	SelectControl,
	TextControl,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";

function Edit({ attributes, setAttributes, noticeOperations, noticeUI }) {
	const { name, title, url, alt, id, width, height } = attributes;
	const [blobURL, setBlobURL] = useState();

	const imageObject = useSelect(
		(select) => {
			const { getMedia } = select("core");
			return id ? getMedia(id) : null;
		},
		[id],
	);

	const imageSizes = useSelect((select) => {
		return select(blockEditorStore).getSettings().imageSizes;
	}, []);

	const getImageSizeOptions = () => {
		if (!imageObject) {
			return [];
		}

		const options = [];
		const sizes = imageObject.media_details.sizes;
		for (const key in sizes) {
			const size = sizes[key];
			const imageSize = imageSizes.find((s) => s.slug === key);
			if (imageSize) {
				options.push({ label: imageSize.name, value: size.source_url });
			}
		}
		return options;
	};

	const onChangeName = (newName) => {
		setAttributes({ name: newName });
	};

	const onChangeTitle = (newTitle) => {
		setAttributes({ title: newTitle });
	};

	const onChangeAlt = (newAlt) => {
		setAttributes({ alt: newAlt });
	};

	const onSelectImage = (image) => {
		console.log(image);
		if (!image || !image.url) {
			setAttributes({ url: undefined, id: undefined, alt: "" });
			return;
		}
		setAttributes({ url: image.url, id: image.id, alt: image.alt });
	};

	const onChangeImageSize = (newURL) => {
		setAttributes({ url: newURL });
	};

	const onSelectURL = (newURL) => {
		setAttributes({ url: newURL, id: undefined, alt: "" });
	};

	const onUploadError = (message) => {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice(message);
	};

	useEffect(() => {
		if (!id && isBlobURL(url)) {
			setAttributes({ url: undefined, alt: "" });
		}
	}, []);

	useEffect(() => {
		if (isBlobURL(url)) {
			setBlobURL(url);
		} else {
			revokeBlobURL(blobURL);
			setBlobURL();
		}
	}, [url]);

	const handleRemoveImage = () => {
		setAttributes({ url: undefined, alt: "", id: undefined });
	};

	// const handleChangeWidth = (newWidth) => {
	// 	setAttributes({ width: newWidth });
	// };

	// console.log(width);

	// const handleChangeHeight = (newHeight) => {
	// 	setAttributes({ height: newHeight });
	// };

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Image Settings", "hero-section")}>
					{id && (
						<SelectControl
							label={__("Image Size", "hero-section")}
							options={getImageSizeOptions()}
							value={url}
							onChange={onChangeImageSize}
						/>
					)}
					{url && !isBlobURL(url) && (
						<TextareaControl
							label={__("Alt Text", "hero-section")}
							value={alt}
							onChange={onChangeAlt}
							help={__(
								"Alternative text describes your image to people who can't see it. Add a short description with key details",
								"hero-section",
							)}
						/>
					)}
				</PanelBody>
			</InspectorControls>
			<div {...useBlockProps()}>
				<div className="wp-hero-section-text-container">
					<RichText
						placeholder={__("Name", "hero-section")}
						tagName="h1"
						value={name}
						onChange={onChangeName}
						allowedFormats={[]}
					/>
					<RichText
						placeholder={__("Title", "hero-section")}
						tagName="h2"
						value={title}
						onChange={onChangeTitle}
						allowedFormats={[]}
					/>
				</div>
				{url && (
					<div
						className={`wp-hero-section-profile-image ${
							isBlobURL(url) ? " is-loading" : ""
						}`}
					>
						<img src={url} alt={alt} />
						{isBlobURL(url) && <Spinner />}
					</div>
				)}

				<MediaPlaceholder
					className="wp-hero-section-image-container"
					icon="id"
					onSelect={onSelectImage}
					onSelectURL={onSelectURL}
					onError={onUploadError}
					accept="image/*"
					allowedTypes={["image"]}
					disableMediaButtons={url}
					notices={noticeUI}
				/>
			</div>
			{url && (
				<BlockControls group="inline">
					<MediaReplaceFlow
						name={__("Replace Image", "hero-section")}
						onSelect={onSelectImage}
						onSelectURL={onSelectURL}
						onError={onUploadError}
						accept="image/*"
						allowedTypes={["image"]}
						mediaId={id}
						mediaURL={url}
					/>
					<ToolbarButton onClick={handleRemoveImage}>
						{__("Remove Image", "hero-section")}
					</ToolbarButton>
				</BlockControls>
			)}
		</>
	);
}

export default withNotices(Edit);
