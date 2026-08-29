import { Text } from "@mantine/core";

interface SectionHeadingProps {
	children: string;
	mt?: string;
}

const SectionHeading = ({ children, mt }: SectionHeadingProps) => (
	<Text
		size="xs"
		fw={700}
		tt="uppercase"
		c="dimmed"
		mb="xs"
		mt={mt}
		style={{ letterSpacing: "0.05em" }}
	>
		{children}
	</Text>
);

export default SectionHeading;
