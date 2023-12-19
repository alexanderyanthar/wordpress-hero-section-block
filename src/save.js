import { useBlockProps, RichText } from "@wordpress/block-editor";

export default function save({ attributes }) {
	const { name, title, url, alt, id } = attributes;
	return (
		<div {...useBlockProps.save()}>
			<div className="wp-hero-section-text-container">
				<RichText.Content tagName="h1" value={name} />
				<RichText.Content tagName="h2" value={title} />
			</div>
			{url && (
				<div className="wp-hero-section-profile-image">
					<img src={url} alt={alt} className={id ? `wp-image-${id}` : null} />
				</div>
			)}
		</div>
	);
}
